import natural from 'natural'
import { lemmatizer } from 'lemmatizer'
import tf from '@tensorflow/tfjs-node'
import path from 'path'
import { readVocabulary } from './Vocabulary/vocab.js'

import fetch from 'node-fetch'
global.fetch = fetch

const tokenizer = new natural.WordTokenizer()
const stopwords = natural.stopwords

const [MODEL, VOCAB] = await loadFiles()

async function loadFiles () {
  // LOAD THE MODEL RNN (LSTM)
  const fileName = path.resolve('./model/rnn_model/model.json')
  const root = 'file://' + fileName
  const model = await tf.loadLayersModel(root)

  // LOAD THE VOCABULARY
  const vocabulary = await readVocabulary()
  return [model, vocabulary]
}

export async function handleData (data) {
  const tokens = cleanData(data)
  const prediction = await predictData(tokens)
	data.prediction = prediction
}

async function predictData (tokens) {
  // Truncate or pad the tokens array to a length of 100
  tokens = tokens.slice(0, 100)
  while (tokens.length < 100) {
    tokens.push(0) // Assuming 0 is an appropriate padding value
  }

  // Train model with data_train
  const data = Float32Array.from(tokens)
  const tensorKeras = tf.tensor2d([data]) // Specify the shape explicitly
  const predictions = await MODEL.predict(tensorKeras).dataSync()
  return predictions
}

function cleanData (jsonData) {
  // Obtén el texto del JSON
  const text = jsonData.content + jsonData.title

  // Elimina todas las etiquetas HTML
  const textoSinHTML = text.replace(/<[^>]*>/g, '')

  // Elimina los números y signos de puntuación
  const textoLimpio = textoSinHTML.replace(
    /[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
    ''
  )

  // Tokenización
  const tokens = tokenizer.tokenize(textoLimpio.toLowerCase())

  // Lematización (opcional)
  const lemmatizedTokens = tokens.map(token => lemmatizer(token))

  // Eliminación de stopwords (opcional)
  const filteredTokens = lemmatizedTokens.filter(
    token => !stopwords.includes(token)
  )

  const indices = filteredTokens.map(token => {
    const indice = VOCAB[token]
    return indice !== undefined && indice <= 9999 ? indice : 0
  })
  return indices
}
