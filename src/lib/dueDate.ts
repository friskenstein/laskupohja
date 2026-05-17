import type { State } from '../types/state'
import {
	calculateDueDate as calculateLocalDueDate,
	formatLocalDate,
	tryCalculateDueDate,
} from './invoice/calculation/dates'

export function calculateDueDate(state: State): string {
	const dueDate = calculateDueDateLocalDate(state)

	return dueDate ? formatLocalDate(dueDate, 'fi-FI') : ''
}

export function calculateDueDateLocalDate(state: State): string | null {
	return tryCalculateDueDate(state.invoiceDate, state.dueDays)
}

export function formatInvoiceDate(state: State): string {
	try {
		return formatLocalDate(state.invoiceDate, 'fi-FI')
	} catch {
		return ''
	}
}

export function calculateValidatedDueDateLocalDate(state: State): string {
	return calculateLocalDueDate(state.invoiceDate, Number(state.dueDays))
}
