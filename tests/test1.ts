import puppeteer = require("puppeteer");
import pcb = require("../src/index");

(async () => {
  let browser = await puppeteer.launch({
    headless: false
  });
  let page = await browser.newPage();
  pcb.blockRequests(page, ["png", "jpg", "jpeg"], ["xhr"]);
  await page.goto("https://youtube.com");
  await page.waitFor(10000);
  await browser.close();
})();