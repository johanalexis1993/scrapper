const puppeteer = require('puppeteer')
const fs = require('fs')
const gameArrays = []
const write = (gameArrays) =>
  fs.writeFile('games.json', JSON.stringify(gameArrays), () =>
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
    repeat(page, browser)
  } catch (error) {
    write(gameArrays)
    await browser.close()
  }
}
const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  /*await page.goto(url, { timeout: 60000 }) Aumentamos el tiempo de espera a 60 segundos si necesitaramos mas tiempo*/
  await page.goto(url)
  await page.setViewport({ width: 1200, height: 1000 })
  repeat(page, browser)
}
module.exports = { scrapper }
