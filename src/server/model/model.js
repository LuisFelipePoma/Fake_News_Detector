import natural from 'natural'
import { lemmatizer } from 'lemmatizer'
import { Tokenizer } from "tf_node_tokenizer"
const bow = new Tokenizer({ num_words: 100, oov_token:"<unk>", });
import tf from '@tensorflow/tfjs-node'
import path from 'path'
import fetch from 'node-fetch'
global.fetch = fetch

const tokenizer = new natural.WordTokenizer()
const stopwords = natural.stopwords

// add layers to your model here

export async function cleanData (jsonData) {
  // const handler = tf.io.('nmvrnn_model/model.json')
  const fileName = path.resolve('./model/rnn_model/model.json')
  const root = 'file://' + fileName
	
  // const model = await tf.loadLayersModel("http://localhost:3000/model")
  const model = await tf.loadLayersModel(root)

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
	// bow.fitOnTexts(textoSinHTML)
	// const representation = bow.textsToSequences(filteredTokens)
  jsonData.content = filteredTokens
  return jsonData
}

// const predictions = await modelPerceptron.predict(tensorKeras).dataSync()
