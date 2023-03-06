import cp from 'node:child_process'

import { UPower } from './types'
import { uPowerMultiParser, uPowerSingleParser } from './uPowerParser'

export async function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    const spawn = cp.spawn(command, { shell: true })
    spawn.on('error', (err) => {
      reject(err)
    })

    spawn.stdout.on('data', (chunk) => {
      data += chunk
    })

    spawn.on('close', () => {
      resolve(data)
    })
  })
}

export async function readUPowerStatistics(): Promise<UPower[]> {
  const output = await runCommand('upower -d')

  return uPowerMultiParser(output)
}

export async function readUPowerStatisticsFrom(device: string): Promise<UPower> {
  const output = await runCommand(`upower -i ${device}`)

  return uPowerSingleParser(output)
}

export async function listUPowerDevices(): Promise<string[]> {
  const output = await runCommand('upower -e')

  return output.split('\n').filter(Boolean)
}

export enum UPowerDeviceState {
  UNKNOWN = 'unknown',
  CHARGING = 'charging',
  DISCHARGING = 'discharging',
  EMPTY = 'empty',
  FULLY_CHARGED = 'fully-charged',
  PENDING_CHARGE = 'pending-charge',
  PENDING_DISCHARGE = 'pending-discharge',
  LAST = 'last'
}
