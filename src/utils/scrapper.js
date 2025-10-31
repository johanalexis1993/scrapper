const puppeteer = require('puppeteer')
const fs = require('fs')
const gameArrays = []
const write = (gameArrays) =>
  fs.writeFileSync('games.json', JSON.stringify(gameArrays), () =>
    console.log('archivo escrito')
  )
const repeat = async (page, browser) => {
  const arraysDivs = await page.$$('.force-badge')
  for (const gameDiv of arraysDivs) {
    let price
    let title = await gameDiv.$eval('.title', (el) => el.textContent)
    let img = await gameDiv.$eval('img', (el) => el.src)
    try {
      price = await gameDiv.$eval('.price', (el) =>
        parseFloat(el.textContent.slice(0, el.textContent.length - 1))
      )
      const game = {
        title,
        img,
        price
      }
      gameArrays.push(game)
    } catch (error) {
      const game = {
        title,
        img,
        stock: false
      }
      gameArrays.push(game)
    }
  }
  try {
    await page.$eval("[title='Next']", (el) => el.click())
    await page.waitForNavigation()
    console.log('pasamos a la suiguiente pagina')
    console.log(`llevamos ${gameArrays.length} datos recolectados`)
    await repeat(page, browser)
  } catch (error) {
    write(gameArrays)
    await browser.close()
  }
}
const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setDefaultTimeout(20000)
  await page.setViewport({ width: 1200, height: 1000 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    document
      .querySelectorAll('.modal, .cookies, [aria-modal="true"]')
      .forEach((e) => e.remove())
  })
  const trends = 'a[href="https://www.instant-gaming.com/es/tendencias/"]'
  const linkHandle = await page
    .waitForSelector(trends, { visible: true, timeout: 10000 })
    .catch(() => null)
  if (linkHandle) {
    linkHandle.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await page.evaluate(() => {
      document
        .querySelectorAll('.modal, .cookies, [aria-modal="true"]')
        .forEach((e) => e.remove())
    })
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }),
      linkHandle.click()
    ])
  } else {
    console.warn(
      'No encontré el enlace de tendencias, sigo en la página actual.'
    )
  }
  await repeat(page, browser)
}
module.exports = { scrapper }
