const escapeHtml = (value: string): string =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')

const escapeAttribute = escapeHtml

const isSafeHref = (href: string): boolean => {
	const trimmedHref = href.trim()

	if (trimmedHref.startsWith('/') || trimmedHref.startsWith('#')) {
		return true
	}

	try {
		const url = new URL(trimmedHref)

		return ['http:', 'https:', 'mailto:'].includes(url.protocol)
	} catch {
		return false
	}
}

const renderFormattedText = (value: string): string =>
	escapeHtml(value)
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/__(.+?)__/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/_(.+?)_/g, '<em>$1</em>')

const findLinkHrefEnd = (value: string, hrefStart: number): number => {
	let depth = 1

	for (let index = hrefStart + 1; index < value.length; index += 1) {
		if (value[index] === '(') {
			depth += 1
		}

		if (value[index] === ')') {
			depth -= 1

			if (depth === 0) {
				return index
			}
		}
	}

	return -1
}

const renderInlineMarkdown = (value: string): string => {
	let html = ''
	let index = 0

	while (index < value.length) {
		const codeStart = value.indexOf('`', index)
		const linkStart = value.indexOf('[', index)
		const nextSpecialStart = [codeStart, linkStart]
			.filter(specialIndex => specialIndex >= 0)
			.sort((a, b) => a - b)[0]

		if (nextSpecialStart === undefined) {
			html += renderFormattedText(value.slice(index))
			break
		}

		html += renderFormattedText(value.slice(index, nextSpecialStart))

		if (nextSpecialStart === codeStart) {
			const codeEnd = value.indexOf('`', codeStart + 1)

			if (codeEnd === -1) {
				html += renderFormattedText(value.slice(codeStart))
				break
			}

			html += `<code>${escapeHtml(value.slice(codeStart + 1, codeEnd))}</code>`
			index = codeEnd + 1
			continue
		}

		const labelEnd = value.indexOf(']', linkStart + 1)
		const hrefStart = labelEnd >= 0 ? value.indexOf('(', labelEnd + 1) : -1
		const hrefEnd = hrefStart >= 0 ? findLinkHrefEnd(value, hrefStart) : -1

		if (labelEnd === -1 || hrefStart !== labelEnd + 1 || hrefEnd === -1) {
			html += renderFormattedText(value.slice(linkStart, linkStart + 1))
			index = linkStart + 1
			continue
		}

		const href = value.slice(hrefStart + 1, hrefEnd).trim()
		const label = value.slice(linkStart + 1, labelEnd)

		if (isSafeHref(href)) {
			html += `<a href="${escapeAttribute(href)}">${renderInlineMarkdown(label)}</a>`
		} else {
			html += renderFormattedText(label)
		}

		index = hrefEnd + 1
	}

	return html.replaceAll('\n', '<br />')
}

const renderParagraph = (lines: string[]): string =>
	`<p>${renderInlineMarkdown(lines.join('\n'))}</p>`

const renderList = (lines: string[], tagName: 'ol' | 'ul'): string => {
	const items = lines
		.map(line => line.replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))
		.map(item => `<li>${renderInlineMarkdown(item)}</li>`)
		.join('')

	return `<${tagName}>${items}</${tagName}>`
}

export const renderMarkdown = (markdown: string): string => {
	const normalizedMarkdown = markdown.replaceAll('\r\n', '\n').trim()

	if (normalizedMarkdown === '') {
		return ''
	}

	const blocks: string[] = []
	let currentBlock: string[] = []

	const flushBlock = () => {
		if (currentBlock.length === 0) {
			return
		}

		const firstLine = currentBlock[0] ?? ''
		const heading = /^(#{1,6})\s+(.+)$/.exec(firstLine)

		if (heading && currentBlock.length === 1) {
			const level = heading[1].length
			blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`)
		} else if (currentBlock.every(line => /^\s*[-*]\s+/.test(line))) {
			blocks.push(renderList(currentBlock, 'ul'))
		} else if (currentBlock.every(line => /^\s*\d+\.\s+/.test(line))) {
			blocks.push(renderList(currentBlock, 'ol'))
		} else {
			blocks.push(renderParagraph(currentBlock))
		}

		currentBlock = []
	}

	for (const line of normalizedMarkdown.split('\n')) {
		if (line.trim() === '') {
			flushBlock()
			continue
		}

		currentBlock.push(line)
	}

	flushBlock()

	return blocks.join('')
}
