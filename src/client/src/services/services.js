// URL of the API
const URL_BASE = import.meta.env.VITE_BACK_URL

// Function to fetch data from API
export async function fetchDataFromAPI (link) {
  // Build the URL for the API
  const url = `${URL_BASE}/ext?` + new URLSearchParams({ url: link })

  // Try to Call the API
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(news => {
        document.querySelector('.api').innerHTML = `
		<h1>${news.title}<h1>
		<h2>${news.description}<h2>
		<p>${news.content}<p>
	`
      })
  } catch (error) {
    console.error('Error fetching the API :', error)
  }
}
