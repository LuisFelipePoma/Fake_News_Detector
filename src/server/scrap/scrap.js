import chromium from 'playwright-aws-lambda'
import { PAGES_NEWS } from '../consts/const.js'

const cacheLinks = new Map()

async function scrapeLinks(url) {
	const browser = await chromium.launchChromium({ headless: true })
	const page = await browser.newPage()
	await page.goto(url)
	try {
		const links = await page.$$eval('a', linkElements => linkElements.map(link => link.href))
		return links.filter(
			href =>
				href.includes('.html') || href.includes('0') || href.includes('article')
		)
	} catch (error) {
		console.error('Error during scraping:', error)
		throw error
	} finally {
		await browser.close()
	}
}

// Función para mezclar aleatoriamente un arreglo (algoritmo de Fisher-Yates)
function randomLinks(links) {
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
export async function getLinksPage() {
	const index = Math.floor(Math.random() * PAGES_NEWS.length)
	const page = PAGES_NEWS[index]
	console.log(cacheLinks)
	let links = cacheLinks.get(page)

	if (!links) {
		try {
			links = await scrapeLinks(page)
			cacheLinks.set(page, links)
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}

	return randomLinks(links)
}

export async function catchCards() {
	console.log('Catching data')
	for (let i = 0; i < PAGES_NEWS.length; i++) {
		try {
			const links = await scrapeLinks(PAGES_NEWS[i])
			cacheLinks.set(PAGES_NEWS[i], links)
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}
	console.log('Finishing catching data')
}
