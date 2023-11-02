const URL_API = 'https://ia-project-backend.vercel.app'
// const URL_API = 'http://localhost:8000'

// Función para realizar la consulta a la API
async function fetchDataFromAPI () {
  try {
    fetch(`${URL_API}/scrape`)
      .then(res => res.json())
      .then(news => {
				document.querySelector(".api").innerHTML=
				`
					<h1>${news[0].title}<h1>
					<h2>${news[0].subtitle}<h2>
					<p>${news[0].body}<p>
				`
        console.log(news[0]) 	
      })
  } catch (error) {
    console.error('Error en la solicitud a la API:', error)
  }
}

// Llama a la función para obtener datos desde la API
fetchDataFromAPI()
