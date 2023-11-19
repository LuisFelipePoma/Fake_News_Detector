import { fetchCardsAPI, fetchDataFromAPI } from './services/services';

// SELECTORS
let MODEL = undefined;
const $resultsCards = document.querySelector('.results');
const $loadingAnimation = document.querySelector('.loading-animation');

// DOCUMENT FUNCTIONS EVENTS
// Function to get data from form
function createFormGetData() {
	document.getElementById('myForm').addEventListener('submit', function (e) {
		e.preventDefault(); // Avoid page reload

		// Get data from form
		let formData = new FormData(e.target);
		let data = Object.fromEntries(formData);

		// Get URL from data
		const url = data.search;
		// Call function to fetch data from API
		handleUserNewFetch(url);
	});
}

// --------------------------------------------------> Functions

// HANDLE USER PREDICTION
// Handle when user fetches data
async function handleUserNewFetch(url) {
	try {
		// Fetch data from API and predict
		const item = await fetchDataFromAPI(url);
		let prediction = await predict(item.tokens);
		let classname = undefined
		console.log(prediction)
		if (prediction > 0.5) {
			classname = 'Fake';
		} else {
			classname = 'Vera'
			prediction = 1 - prediction
		}
		prediction = Math.round(prediction * 10000) / 100

		$resultsCards.innerHTML = `
      <div class="newsCard" onclick="window.open('${item.url}', '_blank')">
        <img src="${item.image}" alt="${item.title}">
        <h1>${item.title}</h1>
        <p class="${classname}">${classname}</p>
        <h2>${prediction}%</h2>
      </div>
    `;
	} catch (error) {
		console.error(`Error fetching and predicting: ${error}`);
	}
}

// HANDLE APP PREDICTIONS NEWS CARDS
// Handle when loading cards news predictions
async function handleCardsNewFetch() {
	$loadingAnimation.style.display = 'block';
	try {
		const news = await fetchCardsAPI();
		$resultsCards.appendChild(await createCards(news));
	} catch (error) {
		console.error(`Error loading cards: ${error}`);
	} finally {
		$loadingAnimation.style.display = 'none';
	}
}

// Create news cards
async function createCards(news) {
	const $fragment = document.createDocumentFragment();
	for (const item of news) {
		let prediction = await predict(item.tokens);
		let classname = undefined
		if (prediction > 0.5) {
			classname = 'Fake';
		} else {
			classname = 'Vera'
			prediction = 1 - prediction
		}
		prediction = Math.round(prediction * 10000) / 100

		console.log(news)
		const $card = document.createElement('div');
		$card.classList.add('newsCard');
		$card.classList.add('newsFake');
		$card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h1>${item.title}</h1>
      <p class="${classname}">${classname}</p>
      <h2>${prediction}%</h2>
    `;
		$card.addEventListener('click', () => {
			window.open(item.url, '_blank');
		});
		$fragment.appendChild($card);
	}
	return $fragment;
}

// Load Models
async function loadModels() {
	console.log("loading models...")
	try {
		MODEL = await tf.loadLayersModel('model/rnn_model/model.json');
	} catch (error) {
		console.error(`Error loading model: ${error}`);
	}
}

// Predict using the model
async function predict(inputData) {
	try {
		// Create a dataset from the inputData
		const dataset = tf.data.array([inputData]);

		// Map the predict function over the dataset
		const predictions = dataset.mapAsync(async (input) => {
			// Check if input is not empty
			const tensorKeras = tf.tensor2d([input], [1, input.length]);
			const response = await MODEL.predict(tensorKeras).dataSync();
			let prediction = response[0];
			return prediction;
		});

		// Get all predictions
		const predictionArray = await predictions.toArray();

		// Filter out undefined values
		const validPredictions = predictionArray.filter(prediction => prediction !== undefined);

		return validPredictions;
	} catch (error) {
		console.error(`Failed to predict: ${error}`);
	}
}

// INIT
(async () => {
	await loadModels();
	createFormGetData(); // Create form event to get data
	await handleCardsNewFetch();
})();

