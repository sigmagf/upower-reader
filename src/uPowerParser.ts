import _get from 'lodash.get'
import _set from 'lodash.set'

import { UPower } from './types'
import {
  getSpacesBeforePropName,
  nameNormalizer,
  isBaseProperty,
  BASE_PROPERTY_SPACES,
  formatISOWithTimezone,
  FORCE_STRING_KEYS
} from './utils'

type ValueType = string | number | boolean | Date | [string, number, string]

function getPropNamePath(propName: string, index: number, array: string[]): string {
  let propNameSpaces = getSpacesBeforePropName(propName)
  let propNamePath = nameNormalizer(propName)

  if (!isBaseProperty(propName)) {
    for (let i = index - 1; i >= 0; i--) {
      const parentPropName = array[i]
      const currentPropNameSpaces = getSpacesBeforePropName(parentPropName)

      if (currentPropNameSpaces === propNameSpaces - BASE_PROPERTY_SPACES) {
        if (propNamePath != null && propNamePath.length > 0) {
          propNamePath = nameNormalizer(parentPropName) + '.' + propNamePath
        } else {
          propNamePath = nameNormalizer(parentPropName)
        }
      }

      if (currentPropNameSpaces > BASE_PROPERTY_SPACES) {
        propNameSpaces = currentPropNameSpaces
      } else if (currentPropNameSpaces === BASE_PROPERTY_SPACES) {
        break
      }
    }
  }

  if (propNamePath.includes('.')) {
    const dividerIndex = propNamePath.indexOf('.')
    const rest = propNamePath.slice(dividerIndex + 1)

    return `deviceInfo.${rest}`
  }

  return propNamePath
}

function valueNormalizer(value: string, key: string): ValueType {
  if (value == null || value.length === 0) {
    return null
  }

  value = value.trim().replace(/'/g, '')

  if (FORCE_STRING_KEYS.includes(key)) {
    return value
  }

  if (value.includes('\t')) {
    const [date, number, unit] = value.split('\t')

    return [formatISOWithTimezone(new Date(Number(date) * 1000), 0), Number(number), unit]
  }

  if (value === 'yes' || value === 'no') {
    return value === 'yes'
  }

  if (!Number.isNaN(Number(value)) || value.match(/\d%$/)) {
    return Number(value.replace('%', ''))
  }

  try {
    const date = new Date(value)
    if (date != null && date.toString() !== 'Invalid Date') {
      return formatISOWithTimezone(date)
    }
  } catch {
    // do nothing
  }

  return value
}

function splitPropNameAndValue(row: string): [string, string] {
  if (row.includes(':')) {
    const dividerIndex = row.indexOf(':')
    const propName = row.slice(0, dividerIndex)
    const val = row.slice(dividerIndex + 1)

    return [propName, val]
  }

  const spacesBefore = getSpacesBeforePropName(row)

  return [''.padEnd(spacesBefore, ' '), row]
}

export function uPowerSingleParser(output: string): UPower {
  const rows = output.split('\n')

  return rows.reduce((acc, cur, index, self) => {
    const [propName, val] = splitPropNameAndValue(cur)
    const key = getPropNamePath(propName, index, self)
    const value = valueNormalizer(val, key)

    if (key == null || key === '') {
      return acc
    }

    if (key === 'historyCharge' || key === 'historyRate') {
      if (value != null) {
        if (_get(acc, key) == null) {
          _set(acc, key, [])
        }

        _get(acc, key).push(value as any)
      }
    } else {
      if (_get(acc, key) != null) {
        _set(acc, key, [...(_get(acc, key) as any), value])
      } else {
        _set(acc, key, value)
      }
    }

    return acc
  }, {} as UPower)
}

export function uPowerMultiParser(output: string): UPower[] {
  const items = output
    .split('\n\n')
    .filter((_) => _.match(/^Device:/) && _.match(/^\s*serial:/m))
    .map(uPowerSingleParser)

  return items
}
