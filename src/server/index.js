// es6 module
import { extract } from '@extractus/article-extractor'
import express, { json } from 'express'
import cors from 'cors'
import { getLinksPage } from './scrap/scrap.js'

// CONST CACHE
let cacheRequest = new Map()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
  res.send('APIS for Web Scrapping!!!')
})

app.post('/scrap', async (req, res) => {
  const query = req.body
  const items = query.links

  const promises = items.map(async item => {
    if (cacheRequest.has(item)) return cacheRequest.get(item)
    const _new = await extract(item)
    const body = {
      title: _new.title ? _new.title : 'No title',
      image: _new.image
        ? _new.image
        : 'https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg',
      url: _new.url ? _new.url : item
    }
    cacheRequest.set(item, body)
    return body
  })

  const news = await Promise.all(promises)
  res.status(201).json(news)
})

app.get('/cards/:key', async (req, res) => {
  const { key } = req.params
  const items = await getLinksPage(key)
  const promises = items.map(async item => {
    if (cacheRequest.has(item)) return cacheRequest.get(item)
    const _new = await extract(item)
    const body = {
      title: _new.title ? _new.title : 'No title',
      image: _new.image
        ? _new.image
        : 'https://static.vecteezy.com/system/resources/previews/005/337/799/large_2x/icon-image-not-found-free-vector.jpg',
      url: _new.url ? _new.url : item
    }
    cacheRequest.set(item, body)
    return body
  })

  const news = await Promise.all(promises)
  res.status(201).json(news)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
