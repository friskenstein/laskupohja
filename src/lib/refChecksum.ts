import { calculateFinnishReferenceNumberChecksum } from './invoice/payment/references/finnishReference'

export function refChecksum(reference: string): number {
	return calculateFinnishReferenceNumberChecksum(reference)
}
