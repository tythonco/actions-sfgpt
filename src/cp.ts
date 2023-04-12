import * as cp from 'child_process'

export default function spawnSync(
  command: string,
  args: string[],
  options: cp.SpawnSyncOptions = {
    cwd: '.',
    encoding: 'utf-8',
    env: process.env,
    shell: true
  }
): cp.SpawnSyncReturns<string | Buffer> | null {
  const ret: cp.SpawnSyncReturns<string | Buffer> = cp.spawnSync(
    command,
    args,
    options
  )
  if (ret.stderr) {
    throw new Error(`${ret.stderr}`)
  }
  return ret
}
