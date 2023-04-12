/** Credit: https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object */
import * as fs from 'fs'

export default function readFiles(
  dirName: string,
  onFileContent: Function,
  onError: Function
): void {
  try {
    const fileNames = fs.readdirSync(dirName, {encoding: 'utf-8'})
    fileNames.map(fileName => {
      const path: string = dirName + fileName
      if (fs.lstatSync(path).isDirectory()) {
        // Recursively call function for nested directories
        readFiles(`${path}/`, onFileContent, onError)
      } else {
        const content: string = fs.readFileSync(path, {
          encoding: 'utf-8'
        })
        onFileContent(fileName, content)
      }
    })
  } catch (err) {
    onError(err)
  }
}
