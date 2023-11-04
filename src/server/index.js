// es6 module
import { extract } from '@extractus/article-extractor'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 8000

app.use(cors())

app.get('/', (req, res) => {
  res.send('APIS for Web Scrapping!!!')
})

app.get('/ext', async (req, res) => {
  const query = req.query.url
  const decodedValue = decodeURIComponent(query)
  const items = decodedValue.split(',')
  const news = []
  for (let item of items) {
    const _new = await extract(item)
    news.push(_new)
  }
  res.json(news)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
