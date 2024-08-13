import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const deleteImage = (fileName) => {
  let filePath
  if (fileName.includes('uploads')) {
    filePath = path.join(__dirname, '../../', fileName)
  } else {
    filePath = path.join(__dirname, '../../', 'uploads', fileName)
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', fileName)
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err)
        } else {
          console.log('File deleted successfully:', fileName)
        }
      })
    }
  })
}
