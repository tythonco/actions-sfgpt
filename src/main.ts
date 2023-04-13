import * as core from '@actions/core'
import ai from './ai'
import * as sfDiff from './sf'

async function run(): Promise<void> {
  try {
    sfDiff.prep()
    sfDiff.createDelta()
    const sfMetadataContent: string = sfDiff.createSFMetadataContent()
    const ai_resp: string = (await ai(sfMetadataContent)) || ''
    // Escape backticks and triple backticks See: https://webapps.stackexchange.com/questions/136172/does-github-have-an-escape-character-for-their-markup
    const ai_resp_sanitized: string = ai_resp
      .replace(/`/g, '\\`')
      .replace(/\\`\\`\\`/g, '\\```')
    core.setOutput('ai_comment', ai_resp_sanitized)
    sfDiff.cleanup()
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(err.message)
    }
  }
}

run()
