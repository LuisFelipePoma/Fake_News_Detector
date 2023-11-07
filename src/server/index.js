// es6 module
import { extract } from '@extractus/article-extractor'
import express, { json } from 'express'
import cors from 'cors'
import { catchCards, getLinksPage } from './scrap/scrap.js'
import { getBody } from './schema/schema.js'
import { cleanData } from './model/model.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CONST CACHE
let cacheRequest = new Map()
const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
  res.send('APIS for Web Scrapping!!!')
})

app.get('/scrap', async (req, res) => {
  console.log('Request to /scrap')
  const item = req.query.url
  if (cacheRequest.has(item)) return cacheRequest.get(item)
  const _new = await extract(item)
  const news = getBody(_new)
  cacheRequest.set(item, news)
  console.log('Return', { ...news })
  res.status(201).json(news)
})

app.get('/cards/', async (req, res) => {
  console.log(`Request to /cards/`)
  const items = await getLinksPage()
  console.log(`Get ${items}`)
  const promises = items.map(async item => {
    if (cacheRequest.has(item)) return cacheRequest.get(item)
    try {
      const _new = await extract(item)
      const body = getBody(_new)
      await cleanData(body)

      cacheRequest.set(item, body)
      return body
    } catch (error) {
      console.error('Error during scraping:', error)
      const body = getBody(null)
      return body
    }
  })
  const news = await Promise.all(promises)
  console.log('Return', { ...news })
  res.status(201).json(news)
})

app.get('/model', (req, res, next) => {
  const options = {
    root: path.join(__dirname)
  }
  console.log('Request to /model')
  const fileName = './model/rnn_model/model.json'
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

app.listen(PORT, '0.0.0.0', async () => {
	console.log(__dirname)
  await catchCards()
  console.log(`✅ Server is running on port ${PORT}`)
})
