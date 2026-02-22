export function formatEpochDate(value) {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (!Number.isFinite(num)) return '-'
  const date = new Date(num)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}
