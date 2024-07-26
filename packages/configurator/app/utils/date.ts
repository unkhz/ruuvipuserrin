export function getDateAndTime(inputDatetime?: string) {
  const date = inputDatetime ? new Date(inputDatetime) : new Date()
  const yyyy = date.getFullYear()
  const mm = `${date.getMonth() + 1}`.padStart(2, '0')
  const dd = `${date.getDate()}`.padStart(2, '0')
  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: date.toLocaleTimeString(),
  }
}
