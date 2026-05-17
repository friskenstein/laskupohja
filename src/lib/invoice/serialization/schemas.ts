import { z } from 'zod'
import { supportedCurrencyCodes } from '../domain/currencies'

export const postalAddressSchema = z
	.object({
		addressLine1: z.string(),
		addressLine2: z.string(),
		country: z.string(),
	})
	.strict()

export const contactDetailsSchema = z
	.object({
		phone: z.string(),
		email: z.string(),
		website: z.string(),
	})
	.strict()

export const partyIdentifierSchema = z
	.object({
		label: z.string(),
		value: z.string(),
	})
	.strict()

export const partySchema = z
	.object({
		name: z.string(),
		postalAddress: postalAddressSchema,
		identifiers: z.array(partyIdentifierSchema),
		contactDetails: contactDetailsSchema,
	})
	.strict()

export const editableInvoiceIdentitySchema = z
	.object({
		invoiceNumber: z.string(),
		invoiceDate: z.string(),
		paymentTermDays: z.string(),
	})
	.strict()

export const editableInvoiceLineSchema = z
	.object({
		description: z.string(),
		quantity: z.string(),
		unit: z.string(),
		unitPrice: z.string(),
		vatRate: z.string(),
	})
	.strict()

export const paymentDetailsSchema = z
	.object({
		iban: z.string(),
		swiftBic: z.string(),
		bankName: z.string(),
		bankAddress: postalAddressSchema,
		paymentReference: z.string(),
	})
	.strict()

export const editableInvoiceContentSchema = z
	.object({
		identity: editableInvoiceIdentitySchema,
		seller: partySchema,
		buyer: partySchema,
		lines: z.array(editableInvoiceLineSchema),
		paymentDetails: paymentDetailsSchema,
		note: z.string(),
	})
	.strict()

export const layoutVariantIdSchema = z.enum(['finnish-bank-transfer', 'international-invoice'])
export const currencyCodeSchema = z.enum(supportedCurrencyCodes)

export const editableInvoiceDocumentSelectionSchema = z
	.object({
		content: editableInvoiceContentSchema,
		layoutVariantId: layoutVariantIdSchema,
		currency: currencyCodeSchema,
	})
	.strict()

export const shareableInvoiceUrlPayloadSchema = z
	.object({
		version: z.literal(1),
		selection: editableInvoiceDocumentSelectionSchema,
	})
	.strict()

export const shareableInvoiceUrlEnvelopeSchema = z
	.object({
		version: z.number(),
		selection: z.unknown(),
	})
	.strict()
