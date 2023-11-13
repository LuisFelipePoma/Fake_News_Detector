import { VOCAB } from './vocab.js'
import natural from 'natural'
const lemmatizer = natural.LancasterStemmer

import fetch from 'node-fetch'
global.fetch = fetch

import { SEQUENCE_LENGTH, VOCAB_SIZE } from '../consts/const.js'


const tokenizer = new natural.WordTokenizer()
const stopword = natural.stopwords


export function handleData(data) {
	const tokens = cleanData(data)
	const representation = prepareData(tokens)
	data.tokens = representation
}

function prepareData(tokens) {
	// Truncate or pad the tokens array to a length of 100
	// tokens = tokens.slice(0, SEQUENCE_LENGTH)
	// while (tokens.length < SEQUENCE_LENGTH) {
	// 	tokens.push(2) // Assuming 0 is an appropriate padding value
	// }
	return tokens
}

function decontract(text) {
	text = text.replace(/won\'t/g, "will not");
	text = text.replace(/can\'t/g, "can not");
	text = text.replace(/n\'t/g, " not");
	text = text.replace(/\'re/g, " are");
	text = text.replace(/\'s/g, " is");
	text = text.replace(/\'d/g, " would");
	text = text.replace(/\'ll/g, " will");
	text = text.replace(/\'t/g, " not");
	text = text.replace(/\'ve/g, " have");
	text = text.replace(/\'m/g, " am");
	return text;
}



function processing_text(text) {
	// Regular expression to find links
	let regex_links = /https?:\/\/\S+|www\.\S+/gi;

	// Remove links from text
	let processed_feature = text.replace(regex_links, '');

	// 1. Clean texts
	processed_feature = processed_feature.replace(/[^a-zA-Z0-9 ]/g, ''); // Remove special characters with a regular expression (not words).
	processed_feature = processed_feature.replace(/[0-9]+/g, ' '); // Remove numbers (Very sporadic occurrences in our dataset)
	processed_feature = processed_feature.toLowerCase(); // Convert all text to lowercase

	// 2. Stop words & lemmatization
	// let stop_words = stopword.en;

	processed_feature = processed_feature.split(' ');
	processed_feature = processed_feature.filter(word => !stopword.includes(word));
	processed_feature = processed_feature.map(word => lemmatizer.stem(word));
	processed_feature = processed_feature.join(' ');


	processed_feature = processed_feature.replace(/\b[a-zA-Z]\b/g, ''); // Remove occurrences of individual characters
	processed_feature = processed_feature.replace(/ +/g, ' '); // Simplify consecutive spaces to a single space between words
	// remove jump lines and tabs
	processed_feature = processed_feature.replace(/(\r\n|\n|\r|\t)/gm, " ");
	return processed_feature;
}
function cleanData(jsonData) {
	// Obtén el texto del JSON
	let text = jsonData.content + ' ' + jsonData.title

	// Elimina todas las etiquetas HTML
	text = text.replace(/<[^>]*>/g, '')

	// Elimina los números y signos de puntuación
	text = decontract(text)
	text = processing_text(text)
	text = text.replace(
		/[0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~’”]/g,
		''
	)
	
	// Tokenización
	const tokens = tokenizer.tokenize(text.toLowerCase())
	
	// Embedding
	const indices = tokens.map(token => {
		const indice = VOCAB[token]
		// return indice !== undefined && indice < VOCAB_SIZE ? indice : 0
		if (indice !== undefined) {
			return indice
		}
		return 500
	})
	return indices
}
