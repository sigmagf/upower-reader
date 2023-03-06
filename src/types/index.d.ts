export interface UPowerDeviceInfo {
  rechargeable?: boolean
  warningLevel: string
  percentage: number
  iconName: string
}

export interface UPowerBatteryInfo extends UPowerDeviceInfo {
  present: boolean
  state: UPowerDeviceState
  energy: string
  energyEmpty: string
  energyFull: string
  energyFullDesign: string
  energyRate: string
  voltage: string
  chargeCycles: string
  timeToFull: string
  capacity: number
  technology: string
}

export interface UPower<DeviceInfo extends UPowerDeviceInfo = UPowerDeviceInfo> {
  device: string
  nativePath: string
  vendor?: string
  model: string
  serial: string
  powerSupply: boolean
  updated: string
  hasHistory: boolean
  hasStatistics: boolean
  deviceInfo: DeviceInfo
  historyCharge: [string, number, string]
  historyRate: [string, number, string]
}

export function readUPowerStatistics(): Promise<UPower[]>
export function readUPowerStatisticsFrom(device: string): Promise<UPower>
export function listUPowerDevices(): Promise<string[]>

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
