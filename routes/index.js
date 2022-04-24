var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Max\'s Website', terrariaLink: '#terraria' });
});

router.get('/scraper', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

  game = req.query.game;


  // Humble Bundle
  try {
    await page.goto('https://www.humblebundle.com/store/search?sort=bestselling&search=' + game);
    el = await page.$('.entity-link');
    await el.click();
    await page.waitForNavigation();


    title = await page.evaluate(() => {
      return document.querySelector(".property-view").innerHTML;
    })

    price = await page.evaluate(() => {
      return document.querySelector(".current-price").innerHTML;
    })
    humble = title + " " + price;
  }
  catch (error) {
      humble = ( "Failed to scrape :(");
  }

  // Steam
  try {
    await page.goto('https://store.steampowered.com/search/?term=' + game);
    el = await page.$('.search_result_row');
    await el.click();
    await page.waitForNavigation();

    title = await page.evaluate(() => {
      return document.querySelector(".apphub_AppName").innerHTML;
    })

    price = await page.evaluate(() => {
      return document.querySelector(".game_purchase_price").innerHTML;
    })

    steam = title + " " + price;

  }
  catch (error) {
    steam = ("Failed to scrape :(");
  }


  await browser.close();
  // Responce
  res.render('terraria', {humble: humble, steam: steam, title: 'Scape for ' + game});
})



module.exports = router;
