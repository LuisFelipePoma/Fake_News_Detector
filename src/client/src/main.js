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

// Functions

// HANDLE USER PREDICTION
// Handle when user fetches data
async function handleUserNewFetch(url) {
	try {
		// Fetch data from API and predict
		const res = await fetchDataFromAPI(url);
		const item = await res.json();
		let prediction = await predict(item.tokens);
		let classname = undefined
		if (prediction > 0.5) {
			classname = 'Vera'
		} else {
			classname = 'Fake';
			prediction = 1 - prediction
		}
		prediction = Math.round(prediction * 10000) / 100
		console.log(item)
		console.log(prediction)


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
		const res = await fetchCardsAPI();
		const news = await res.json();
		$resultsCards.appendChild(await createCards(news));
		$loadingAnimation.style.display = 'none';
	} catch (error) {
		console.error(`Error loading cards: ${error}`);
	}
}

// Create news cards
async function createCards(news) {
	const $fragment = document.createDocumentFragment();
	for (const item of news) {
		let prediction = await predict(item.tokens);
		let classname = undefined
		if (prediction > 0.5) {
			classname = 'Vera'
		} else {
			classname = 'Fake';
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
		const tensorKeras = tf.tensor2d([inputData]);
		const response = await MODEL.predict(tensorKeras).dataSync();
		console.log(response)
		let prediction = response[0];
		return prediction
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
