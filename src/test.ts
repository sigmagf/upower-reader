import { readUPowerStatistics } from '.'

async function main(): Promise<void> {
  const stats = await readUPowerStatistics()
  console.log(stats)
}

main()
