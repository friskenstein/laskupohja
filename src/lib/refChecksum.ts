export function refChecksum(reference: string): number {
	// TODO: add validation - return empty string if invalid
	return (
		10 -
		(reference
			.split('')
			.reverse()
			.reduce((acc, c, i) => {
				const mult = i % 3 === 0 ? 7 : i % 3 === 1 ? 3 : 1
				return acc + parseInt(c) * mult
			}, 0) %
			10)
	)
}
