import chromium from 'playwright-aws-lambda'

import { PAGES_NEWS } from '../consts/const.js'

const cacheLinks = new Map()

async function scrapeLinks (url, keyword) {
  const browser = await chromium.launchChromium({ headless: true })

  const page = await browser.newPage()
  await page.goto(url)

  try {
    const links = await page.evaluate(keyword => {
      const linkElements = Array.from(document.querySelectorAll('a'))
      return linkElements
        .map(link => link.href)
        .filter(
          href =>
            href.includes(keyword) ||
            href.includes('.html') ||
            href.includes('0') ||
            href.includes('article')
        )
    }, keyword)

    return links
  } catch (error) {
    console.error('Error during scraping:', error)
    return []
  } finally {
    await browser.close()
  }
}

// Función para mezclar aleatoriamente un arreglo (algoritmo de Fisher-Yates)
function randomLinks (links) {
  // Genera dos índices aleatorios diferentes
  const index1 = Math.floor(Math.random() * links.length)
  let index2
  do {
    index2 = Math.floor(Math.random() * links.length)
  } while (index2 === index1) // Asegura que los índices sean diferentes

  // Retorna los enlaces correspondientes a los índices generados
  return [links[index1], links[index2]]
}

// ------------> FUNCTION TO GET LINKS OF THE PAGES |-> EXPORT
export async function getLinksPage (keyword) {
  const index = Math.floor(Math.random() * PAGES_NEWS.length)
  const page = PAGES_NEWS[index]

  let links = cacheLinks.get(page)
  if (links) return randomLinks(links)

  try {
    links = await scrapeLinks(page, keyword)

    // Aquí, si tienes una gran cantidad de enlaces, puedes paginar o cargar enlaces de manera diferida

    cacheLinks.set(page, links)
    return randomLinks(links)
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}
