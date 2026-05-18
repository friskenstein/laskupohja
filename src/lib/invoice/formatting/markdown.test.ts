import { renderMarkdown } from './markdown'

declare const expect: (actual: unknown) => {
	toBe: (expected: unknown) => void
}
declare const test: (name: string, run: () => void) => void

test('renders markdown blocks and inline formatting', () => {
	expect(
		renderMarkdown(`# Payment notes

Please pay **promptly**.

---

- Use reference \`12344\`
- Contact [billing](mailto:billing@example.test)`)
	).toBe(
		'<h1>Payment notes</h1><p>Please pay <strong>promptly</strong>.</p><hr /><ul><li>Use reference <code>12344</code></li><li>Contact <a href="mailto:billing@example.test">billing</a></li></ul>'
	)
})

test('renders ordered lists', () => {
	expect(
		renderMarkdown(`1. First
2. Second`)
	).toBe('<ol><li>First</li><li>Second</li></ol>')
})

test('escapes unsafe note markdown', () => {
	expect(renderMarkdown('<script>alert("x")</script> [bad](javascript:alert(1))')).toBe(
		'<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; bad</p>'
	)
})
