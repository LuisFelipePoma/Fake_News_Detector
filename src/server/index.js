// es6 module
import { extract } from '@extractus/article-extractor'

import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import cors from 'cors'

const app = express()
const PORT = 8000

app.use(cors())

app.get('/', (req, res) => {
  res.send('APIS for Web Scrapping!!!')
})


app.get('/ext', async (req, res) => {
  const url = req.query.url
  const newsUrl = url
  const article = await extract(newsUrl)
  res.json(article)
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
