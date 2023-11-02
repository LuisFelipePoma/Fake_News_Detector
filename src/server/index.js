import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import cors from 'cors'

const app = express()
const PORT = 8000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Ruta para realizar el web scraping
app.get('/scrape', async (req, res) => {
  try {
    // URL de la página de noticias que deseas raspar
    const newsUrl = 'https://www.bbc.com/news/world-us-canada-67293355'

    // Realiza una solicitud HTTP para obtener el contenido de la página
    const response = await axios.get(newsUrl)
    const html = response.data

    // Utiliza Cheerio para analizar el HTML
    const $ = cheerio.load(html)

    // Selecciona los elementos que contienen los títulos y cuerpos de los artículos
    const articles = []

    // Por ejemplo, si los títulos están en etiquetas <h2> y los cuerpos en etiquetas <p>, puedes hacer algo como esto:
    $('article').each((index, articleElement) => {
      // Busca el título dentro del elemento <article>
      const title = $(articleElement).find('h1').text()
      const subtitle = $(articleElement).find('h2').text()

      // Busca el cuerpo dentro del elemento <article>
      const body = $(articleElement).find('p').text()

      articles.push({ title, subtitle, body })
    })

    // Devuelve los datos raspados como respuesta
    res.json(articles)
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ error: 'Hubo un error al raspar la página de noticias' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
