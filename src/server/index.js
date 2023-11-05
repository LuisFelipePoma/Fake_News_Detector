// es6 module
import { extract } from '@extractus/article-extractor'
import express from 'express'
import cors from 'cors'
import * as tf from '@tensorflow/tfjs'

const app = express()
const PORT = 8000

// CONST CACHE
let cacheRequest = new Map();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('APIS for Web Scrapping!!!')
})

app.post('/ext', async (req, res) => {
  const query = req.body
  const items = query.links

  const promises = items.map(async item => {
    if (cacheRequest.has(item)) return cacheRequest.get(item)
		console.log(`creating item ${item}`)
    const _new = await extract(item)
    const body = {
      title: _new.title,
      image: _new.image,
      url: _new.url
    }
    cacheRequest.set(item,body)
    return body
  })

  const news = await Promise.all(promises)
  res.status(201).json(news)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`)
})
