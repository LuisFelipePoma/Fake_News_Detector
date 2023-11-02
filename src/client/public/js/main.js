const URL_API = 'https://ia-project-backend.vercel.app/'

// Función para realizar la consulta a la API
async function fetchDataFromAPI () {
  try {
    fetch(`${URL_API}/scrape`)
      .then(res => res.json())
      .then(news => {
        console.log(news) 	
      })
  } catch (error) {
    console.error('Error en la solicitud a la API:', error)
  }
}

// Llama a la función para obtener datos desde la API
fetchDataFromAPI()
