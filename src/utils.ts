export const BASE_PROPERTY_SPACES = 2
export const FORCE_STRING_KEYS = ['serial']

export function nameNormalizer(propName: string): string {
  propName = propName.trim()
  propName = propName.replace(/[():]/g, '')
  propName = propName.replace(/[\s-]/g, '_')
  propName = propName.replace(/([_][a-z])/g, (g) => g.toUpperCase().replace('_', ''))
  propName = propName.charAt(0).toLowerCase() + propName.slice(1)

  return propName
}

export function getSpacesBeforePropName(propName: string): number {
  return propName.match(/^\s*/)[0].length
}

export function isBaseProperty(propName: string): boolean {
  return getSpacesBeforePropName(propName) === BASE_PROPERTY_SPACES
}

export function formatISOWithTimezone(date: Date, externalOffset?: number): string {
  const offset = externalOffset ?? date.getTimezoneOffset()
  const offsetHours = Math.abs(Math.floor(offset / 60))
    .toString()
    .padStart(2, '0')
  const offsetMinutes = Math.abs(offset % 60)
    .toString()
    .padStart(2, '0')
  const offsetSign = offset >= 0 ? '-' : '+'

  return date.toISOString().slice(0, 19) + offsetSign + offsetHours + ':' + offsetMinutes
}
