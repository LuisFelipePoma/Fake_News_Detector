// URL of the API
const URL_BASE = import.meta.env.VITE_BACK_URL

// Function to fetch data from API
export async function fetchDataFromAPI (links) {
  // Build the URL for the API
  console.log(links.length)
  const arraySerializado = !Array.isArray ? links.join(',') : links
  console.log(arraySerializado)
  // Codificar la cadena para que sea segura en una URL
  const cadenaCodificada = encodeURIComponent(arraySerializado)

  // Construir la URL con el parámetro
  // var url = 'https://ejemplo.com/miPagina?strings=' + cadenaCodificada
  const url =
    `${URL_BASE}/ext?` + new URLSearchParams({ url: cadenaCodificada })
  // Try to Call the API
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    return response
  } catch (error) {
    console.error('Error fetching the API :', error)
  }
}
