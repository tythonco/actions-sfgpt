import * as core from '@actions/core'
import ai from './ai'
import * as sfDiff from './sf'

async function run(): Promise<void> {
  try {
    sfDiff.prepDelta()
    const sfMetadataContent: string = sfDiff.prepSFMetadataContent()
    const ai_resp = await ai(sfMetadataContent)
    core.setOutput('ai_comment', ai_resp)
    sfDiff.cleanup()
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(err.message)
    }
  }
}

run()
