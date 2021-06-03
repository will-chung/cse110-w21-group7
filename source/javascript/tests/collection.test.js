const puppeteer = require('puppeteer')
const expect = require('chai').expect

describe('testing creating a new collection', () => {
  it('Test1: creating a new collection', async () => {
    const browser = await puppeteer.launch({ headless: true, slowMo: 500 })
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:5500/source/html/collection.html')

    await page.click('#add', { clickCount: 1 })

    await browser.close()
  })

  it('Test2: creating multiple new collections', async () => {

  })

  it('Test3: creating new collection and deleting the collection', async () => {

  })

  it('Test4: creating new collection and editing collection name', async () => {

  })

  it('Test5: creating new collection and going to the collection edit page', async () => {

  })
})
