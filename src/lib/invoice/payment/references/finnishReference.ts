const checksumMultipliers = [7, 3, 1] as const

export const normalizeFinnishReferenceNumber = (reference: string): string =>
	reference.replaceAll(/\s/g, '')

export const calculateFinnishReferenceNumberChecksum = (baseReference: string): number => {
	const checksumBase = normalizeFinnishReferenceNumber(baseReference)
	const weightedSum = checksumBase
		.split('')
		.reverse()
		.reduce((sum, digit, index) => {
			return sum + Number(digit) * checksumMultipliers[index % checksumMultipliers.length]
		}, 0)

	return (10 - (weightedSum % 10)) % 10
}

export const completeFinnishReferenceNumber = (baseReference: string): string =>
	`${normalizeFinnishReferenceNumber(baseReference)}${calculateFinnishReferenceNumberChecksum(
		baseReference
	)}`

export const isValidFinnishReferenceNumber = (reference: string): boolean => {
	const normalized = normalizeFinnishReferenceNumber(reference)

	if (!/^\d{4,20}$/.test(normalized)) {
		return false
	}

	const baseReference = normalized.slice(0, -1)
	const checksum = Number(normalized.at(-1))

	return calculateFinnishReferenceNumberChecksum(baseReference) === checksum
}
