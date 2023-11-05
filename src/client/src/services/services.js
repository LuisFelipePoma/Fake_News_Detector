// URL of the API
const URL_BASE = import.meta.env.VITE_BACK_URL

// Function to fetch data from API
export async function fetchCardsAPI (keyword) {
  const url = URL_BASE + '/cards/' + keyword
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
export async function fetchDataFromAPI (links) {

  // Construir la URL con el parámetro
  // var url = 'https://ejemplo.com/miPagina?strings=' + cadenaCodificada
  // const url =
  //   `${URL_BASE}/ext?` + new URLSearchParams({ url: cadenaCodificada })
  const url = URL_BASE + '/scrap'

  // Try to Call the API
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ links })
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    return response
  } catch (error) {
    console.error('Error fetching the API :', error)
  }
}
