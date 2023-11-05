import chromium from 'playwright-aws-lambda'

import { PAGES_NEWS } from '../consts/const.js'

const cacheLinks = new Map()

async function scrapeLinks (url, keyword) {
  const browser = await chromium.launchChromium({ headless: true }) // Cambia 'chromium' por el navegador de tu elección (firefox, webkit, etc.)

  const page = await browser.newPage()
  await page.goto(url)

  const links = await page.evaluate(keyword => {
    const linkElements = Array.from(document.querySelectorAll('a'))

    const filteredLinks = linkElements.filter(link => {
      const href = link.href
      // Agrega tus condiciones de filtrado aquí
      return (
        href.includes(keyword) ||
        href.includes('.html') ||
        href.includes('0') ||
        href.includes('article')
      )
    })

    return filteredLinks.map(link => link.href)
  }, keyword)

  await browser.close()

  return links
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
    cacheLinks.set(page, links)
    return randomLinks(links)
  } catch (error) {
    console.error('Error:', error)
    return [] // En caso de error, retorna una lista vacía o maneja el error de la manera que desees.
  }
}

// export async function catchLinks () {
//   // Código asincrónico aquí
//   for (let i = 0; i < PAGES_NEWS.length; i++) {
//     const answ = await getLinksPage('article')
//   }
//   // Realiza más operaciones después de que la función asincrónica se haya completado
//   console.log('La operación asincrónica ha terminado con resultado')
// }
