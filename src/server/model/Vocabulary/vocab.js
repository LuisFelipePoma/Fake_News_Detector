import fs from 'fs/promises'
import path from 'path'

export async function readVocabulary (vocab_size) {
  // Ruta al archivo JSON
  const fileName = './model/Vocabulary/vocab.json'
  const route = path.resolve(fileName)

  try {
    // Lee el archivo JSON utilizando fs.promises.readFile
    const data = await fs.readFile(route, 'utf8')

    // Parsea el contenido JSON en un objeto JavaScript
    const vocabulary = JSON.parse(data)

    console.log('Vocabulary loaded successfully!!')
    return vocabulary
  } catch (err) {
    console.error('Cannot read the JSON file:', err)
    return null // Puedes manejar el error de la forma que prefieras
  }
}
