import { fetchDataFromAPI } from './services/services'

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
  fetchDataFromAPI([url])
    .then(res => res.json())
    .then(news => {
      document.querySelector('.api').innerHTML = `
				<h1>${news[0].title}<h1>
				<h2>${news[0].description}<h2>
				<p>${news[0].content}<p>
			`
    })
}
// ----------> HANDLE APP PREDICTIONS NEWS CARD

// Handle when load cards news predictions
function handleCardsNewFetch (urls) {
  $loadingAnimation.style.display = 'block'
  fetchDataFromAPI(urls)
    .then(res => res.json())
    .then(news => {
      $resultsCards.appendChild(createCards(news))
      $loadingAnimation.style.display = 'none'
    })
}

function createCards (news) {
  const $fragment = document.createDocumentFragment()
  news.forEach(item => {
    const $card = document.createElement('article')
    $card.classList.add('newsCard')
    $card.classList.add('newsFake')
    $card.innerHTML = `
			<img src="${item.image}" alt="${item.title}">
			<h3>${item.title}</h3>
			<a href="${item.url}" target="_blank">Read more...</a>
			<h2>20%</h2>
		`

    $fragment.appendChild($card)
  })
  return $fragment
}

const NEWS = [
  'https://edition.cnn.com/2023/11/03/politics/tlaib-biden-palestinian-genocide/index.html',
  'https://www.theguardian.com/us-news/2023/nov/03/israel-aid-democrats-leahy-act-congress',
  'https://www.theguardian.com/world/live/2023/nov/03/israel-hamas-war-live-updates-un-blinken-expected-call-for-pauses-fighting-allow-aid-gaza-tel-aviv-visit',
  'https://edition.cnn.com/2023/09/25/entertainment/keanu-reeves-girlfriend-alexandra-grant/?dicbo=v2-PnWRX9Y&iid=ob_lockedrail_topeditorial',
  'https://edition.cnn.com/2023/09/14/entertainment/sean-penn-will-smith/?dicbo=v2-2kjLto2&iid=ob_lockedrail_topeditorial'
]
// ----------------------- INIT
;(() => {
  createFormGetData() // Create form event to get data
  // $loadingAnimation.style.display = 'block';
  handleCardsNewFetch(NEWS)
})()
