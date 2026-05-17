import type { EditableInvoiceDocumentSelection } from '../domain/types'
import { shareableInvoiceUrlEnvelopeSchema, shareableInvoiceUrlPayloadSchema } from './schemas'

const payloadQueryParameter = 'payload'

type ShareableInvoiceUrlPayload = {
	version: 1
	selection: EditableInvoiceDocumentSelection
}

export type ShareableInvoiceUrlParseFailureReason =
	| 'invalid-url'
	| 'missing-payload'
	| 'malformed-payload'
	| 'unsupported-version'
	| 'invalid-selection'

export type ShareableInvoiceUrlParseResult =
	| {
			ok: true
			selection: EditableInvoiceDocumentSelection
	  }
	| {
			ok: false
			reason: ShareableInvoiceUrlParseFailureReason
	  }

export const encodeShareableInvoiceUrl = (
	baseUrl: string | URL,
	selection: EditableInvoiceDocumentSelection
): string => {
	const url = new URL(baseUrl)
	const payload: ShareableInvoiceUrlPayload = {
		version: 1,
		selection,
	}

	url.search = ''
	url.searchParams.set(payloadQueryParameter, encodePayload(payload))

	return url.toString()
}

export const decodeShareableInvoiceUrl = (
	shareableInvoiceUrl: string | URL
): ShareableInvoiceUrlParseResult => {
	const url = parseUrl(shareableInvoiceUrl)

	if (!url) {
		return { ok: false, reason: 'invalid-url' }
	}

	const payload = url.searchParams.get(payloadQueryParameter)

	if (!payload) {
		return { ok: false, reason: 'missing-payload' }
	}

	const decodedPayload = decodePayload(payload)

	if (!decodedPayload.ok) {
		return { ok: false, reason: 'malformed-payload' }
	}

	const envelope = shareableInvoiceUrlEnvelopeSchema.safeParse(decodedPayload.value)

	if (!envelope.success) {
		return { ok: false, reason: 'malformed-payload' }
	}

	if (envelope.data.version !== 1) {
		return { ok: false, reason: 'unsupported-version' }
	}

	const versionedPayload = shareableInvoiceUrlPayloadSchema.safeParse(decodedPayload.value)

	if (!versionedPayload.success) {
		return { ok: false, reason: 'invalid-selection' }
	}

	return {
		ok: true,
		selection: versionedPayload.data.selection,
	}
}

const parseUrl = (url: string | URL): URL | undefined => {
	try {
		return new URL(url)
	} catch {
		return undefined
	}
}

const encodePayload = (payload: ShareableInvoiceUrlPayload): string => {
	const bytes = new TextEncoder().encode(JSON.stringify(payload))
	let binary = ''

	for (const byte of bytes) {
		binary += String.fromCharCode(byte)
	}

	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

const decodePayload = (
	encodedPayload: string
):
	| {
			ok: true
			value: unknown
	  }
	| {
			ok: false
	  } => {
	try {
		const base64 = encodedPayload
			.replaceAll('-', '+')
			.replaceAll('_', '/')
			.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')
		const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))

		return {
			ok: true,
			value: JSON.parse(new TextDecoder().decode(bytes)),
		}
	} catch {
		return { ok: false }
	}
}
