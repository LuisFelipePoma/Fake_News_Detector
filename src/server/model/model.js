import natural from 'natural'
import { lemmatizer } from 'lemmatizer'
import { readVocabulary } from './Vocabulary/vocab.js'

import fetch from 'node-fetch'
import { SEQUENCE_LENGTH, VOCAB_SIZE } from '../consts/const.js'
global.fetch = fetch

const tokenizer = new natural.WordTokenizer()
const stopwords = natural.stopwords

const VOCAB = await loadFiles()

async function loadFiles() {

	// LOAD THE VOCABULARY
	const vocabulary = await readVocabulary()
	// return [model, vocabulary]
	return vocabulary
}

export function handleData(data) {
	const tokens = cleanData(data)
	const representation = prepareData(tokens)
	data.prediction = representation
}

function prepareData(tokens) {
	// Truncate or pad the tokens array to a length of 100
	tokens = tokens.slice(0, SEQUENCE_LENGTH)
	while (tokens.length < SEQUENCE_LENGTH) {
		tokens.push(0) // Assuming 0 is an appropriate padding value
	}
	return tokens
}

function cleanData(jsonData) {
	// Obtén el texto del JSON
	const text = jsonData.content + ' ' + jsonData.title
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
	console.log("TEXTO\n", filteredTokens)
	let i = 0
	const indices = filteredTokens.map(token => {
		i++
		const indice = VOCAB[token]
		return indice !== undefined && indice < VOCAB_SIZE ? indice : 0
	})
	console.log("size of ", i)
	console.log("size of ", indices.length)
	console.log("size of ", indices)
	return indices
}
