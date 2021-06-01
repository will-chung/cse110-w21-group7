const puppeteer = require ("puppeteer");
const expect = require("chai").expect; 

describe('testing index page', () => {

    it('Test1: Clicking the add icon, new URL should contain daily.html', async () => {
      
        const browser = await puppeteer.launch({headless: false, slowMo: 500})
        const page = await browser.newPage()
        await page.goto("http://127.0.0.1:5500/source/html/index.html")

        await page.click('#cb', {clickCount: 1}) 

        const url = await page.url(); 
        expect(url).to.be.include("127.0.0.1:5500/source/html/daily.html");
        await browser.close()
    }); 

    it('Test2: redirects to the correct monthly log from index', async () => {

    }); 

    it('Test3: go to daily log using nav bar and then go back to index page', async () => {

    }); 

    it('Test4: go to collection using nav bar and then go back to index page', async () => {

    });
    
    it('Test5: go to monthly using nav bar and then go back to index page', async () => {

    }); 








    
});  
