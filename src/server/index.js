// es6 module
import { extract } from '@extractus/article-extractor'
import express, { json } from 'express'
import cors from 'cors'
import { catchCards, getLinksPage } from './scrap/scrap.js'
import { getBody } from './model/model.js'

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
  res.status(201).json(news)
})

app.get('/cards/', async (req, res) => {
  console.log(`Request to /cards/`)
  const items = await getLinksPage()
  const promises = items.map(async item => {
    if (cacheRequest.has(item)) return cacheRequest.get(item)
    const _new = await extract(item)
    const body = getBody(_new)
    cacheRequest.set(item, body)
    return body
  })
  const news = await Promise.all(promises)
  res.status(201).json(news)
})

app.listen(PORT, '0.0.0.0', async () => {
  await catchCards()
  console.log(`✅ Server is running on port ${PORT}`)
})
