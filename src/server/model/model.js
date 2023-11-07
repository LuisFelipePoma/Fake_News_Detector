import natural from 'natural'
import { lemmatizer } from 'lemmatizer'
import tf from '@tensorflow/tfjs-node/dist/index.js'
import path from 'path'
import fetch from 'node-fetch'
global.fetch = fetch

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// import tf from '@tensorflow/tfjs-node'

const tokenizer = new natural.WordTokenizer()
const stopwords = natural.stopwords

// add layers to your model here

export async function cleanData (jsonData) {
  const options = {
    root: path.join(__dirname)
  }
  // const handler = tf.io.('nmvrnn_model/model.json')
  const fileName = path.resolve('./rnn_model/model.json')
  const root = 'file://' + fileName
  console.log(root)
  // const model = await tf.loadLayersModel(root)
  const model = await tf.loadLayersModel(
    tf.io.fileSystem(
      'file://D:\\Codes\\IA-Project\\src\\server\\rnn_model\\model.json'
    )
  )

  // Obtén el texto del JSON
  const text = jsonData.content

  // Elimina todas las etiquetas HTML
  const textoSinHTML = text.replace(/<[^>]*>/g, '')

  // Elimina los números y signos de puntuación
  const textoLimpio = textoSinHTML.replace(
    /[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
    ''
  )

  // Tokenización
  const tokens = tokenizer.tokenize(textoLimpio)

  // Lematización (opcional)
  const lemmatizedTokens = tokens.map(token => lemmatizer(token))

  // Eliminación de stopwords (opcional)
  const filteredTokens = lemmatizedTokens.filter(
    token => !stopwords.includes(token)
  )

  // Convierte los tokens en un texto preprocesado
  // const preprocessedText = filteredTokens.join(' ')

  jsonData.content = filteredTokens
  return jsonData
}

// const predictions = await modelPerceptron.predict(tensorKeras).dataSync()
