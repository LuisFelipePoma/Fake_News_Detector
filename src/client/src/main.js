import { fetchDataFromAPI } from './services/services'

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
    handleFetch(url)
  })
}

// ----------------------- Functions
function handleFetch (url) {
  // Call function to fetch data from API
  fetchDataFromAPI(url)
}

// ----------------------- INIT
;(() => {
  createFormGetData() // Create form event to get data
})()
