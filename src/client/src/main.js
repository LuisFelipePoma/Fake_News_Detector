import { fetchCardsAPI, fetchDataFromAPI } from './services/services'

// SELECTORS-----|

const $resultsCards = document.querySelector('.results')
const $loadingAnimation = document.querySelector('.loading-animation')

// --------------------- DOCUMENTS FUNCTIONS EVENTS
// Function to get data from form
function createFormGetData () {
  document.getElementById('myForm').addEventListener('submit', function (e) {
    e.preventDefault() // Avoid reload page

    // Get data from form
    let formData = new FormData(e.target)
    let data = Object.fromEntries(formData)

    // Get url from data
    const url = data.search
    // Call function to fetch data from API
    handleUserNewFetch(url)
  })
}

// ----------------------- Functions

// ----------> HANDLE USER PREDICTION
// Handle when user fetch data
function handleUserNewFetch (url) {
  // Call function to fetch data from API
  fetchDataFromAPI(url)
    .then(res => res.json())
    .then(item => {
      const prediction = Math.round(item.prediction[0] * 100) / 100
			const classname = prediction < 60 ?  'Vera':'Fake'
      $resultsCards.innerHTML = `
			<div id="#result"class="newsCard" onclick="window.open('${item.url}', '_blank')">
				<img src="${item.image}" alt="${item.title}">
				<h1>${item.title}</h1>
				<p class="${classname}">${classname}<p>
				<h2>${prediction}%</h2>
			</div>
		`
    })
}
// ----------> HANDLE APP PREDICTIONS NEWS CARD

// Handle when load cards news predictions
function handleCardsNewFetch () {
  $loadingAnimation.style.display = 'block'
  fetchCardsAPI()
    .then(res => res.json())
    .then(news => {
      $resultsCards.appendChild(createCards(news))
      $loadingAnimation.style.display = 'none'
    })
}

function createCards (news) {
  const $fragment = document.createDocumentFragment()
  news.forEach(item => {
    const prediction = Math.round(item.prediction[0] * 100) / 100
		const classname = prediction < 60 ?  'Vera':'Fake'

    const $card = document.createElement('div')
    $card.classList.add('newsCard')
    $card.classList.add('newsFake')
    $card.innerHTML = `
			<img src="${item.image}" alt="${item.title}">
			<h1>${item.title}</h1>
			<p class="${classname}">${classname}<p>
			<h2>${prediction}%</h2>
		`
    $card.addEventListener('click', () => {
      window.open(item.url, '_blank')
    })
    $fragment.appendChild($card)
  })
  return $fragment
}

// ----------------------- INIT
;(() => {
  createFormGetData() // Create form event to get data
  // $loadingAnimation.style.display = 'block';
  handleCardsNewFetch()
})()
