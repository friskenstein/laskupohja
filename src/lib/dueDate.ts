import type { State } from '../types/state'

export function calculateDueDate(state: State): string {
	const dueDate = new Date(state.invoiceDate)
	dueDate.setDate(dueDate.getDate() + parseInt(state.dueDays))
	return dueDate.toLocaleDateString('fi-FI')
}

export function calculateDueDateDate(state: State): Date {
	const dueDate = new Date(state.invoiceDate)
	dueDate.setDate(dueDate.getDate() + parseInt(state.dueDays))
	return dueDate
}
