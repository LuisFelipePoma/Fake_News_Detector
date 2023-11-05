import { fetchDataFromAPI } from './services/services'
import { NEWS } from './const/urls'

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
    .then(item => {
      $resultsCards.innerHTML = `
			<article class="newsFake newsCard">
				<img src="${item[0].image}" alt="${item[0].title}">
				<h3>${item[0].title}</h3>
				<a href="${item[0].url}" target="_blank">Read more...</a>
				<h2>20%</h2>
			</article>
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

// ----------------------- INIT
;(() => {
  createFormGetData() // Create form event to get data
  // $loadingAnimation.style.display = 'block';
  handleCardsNewFetch(NEWS)
})()
