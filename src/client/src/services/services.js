// URL of the API
const URL_BASE = import.meta.env.VITE_BACK_URL

// Function to fetch data from API
export async function fetchCardsAPI () {
  const url = URL_BASE + '/cards'
  // Try to Call the API
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    return response
  } catch (error) {
    console.error('Error fetching the API :', error)
  }
}

// Function to fetch data from API
export async function fetchDataFromAPI (page) {
  // Construir la URL con el parámetro
  const url = URL_BASE + `/scrap?url=${encodeURIComponent(page)}`
  // Try to Call the API
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    return response
  } catch (error) {
    console.error('Error fetching the API :', error)
  }
}
