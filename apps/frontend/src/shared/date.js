export function formatEpochDate(value) {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (!Number.isFinite(num)) return '-'
  const date = new Date(num)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}

export function epochToDateInput(value) {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  const date = new Date(num)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function dateInputToEpoch(value) {
  if (!value) return null
  const epoch = new Date(`${value}T00:00:00`).getTime()
  return Number.isNaN(epoch) ? null : epoch
}
