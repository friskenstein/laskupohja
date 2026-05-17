import type { LayoutVariantId, PaymentCapability } from '../domain/types'

export type { LayoutVariantId } from '../domain/types'

export type LayoutVariantMetadata = {
	id: LayoutVariantId
	name: string
	paymentCapabilities: readonly PaymentCapability[]
}

export const layoutVariantMetadata = [
	{
		id: 'finnish-bank-transfer',
		name: 'Finnish bank transfer',
		paymentCapabilities: ['bank-transfer', 'finnish-bank-barcode'],
	},
	{
		id: 'international-invoice',
		name: 'International invoice',
		paymentCapabilities: ['bank-transfer'],
	},
] as const satisfies readonly LayoutVariantMetadata[]

export const getLayoutVariantMetadata = (
	layoutVariantId: LayoutVariantId
): LayoutVariantMetadata => {
	return layoutVariantMetadata.find(({ id }) => id === layoutVariantId) as LayoutVariantMetadata
}
