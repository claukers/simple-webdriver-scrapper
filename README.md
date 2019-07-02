# simple-webdriver-scrapper

**in early development not to use in production**

little wrapper on **selenium-webdriver**[https://www.npmjs.com/package/selenium-webdriver] for checking dom change.

## example

```javascript
const { Scrapper } = require("simple-webdriver-scrapper");

const scrapper = new Scrapper({
  // [optional] option to disable javascript. defaults to false
  disableJavascript: false, 
  // [optional] for choosing the underlying browser. defaults to firefox
  browser: "firefox",
  // [optional] for choosing if the browser driver should be killed after the scrap ( if set to true you need to call driver.quit() in your code for a clean exit )
  // even with keepDriverAlive option set to true a new driver will get created unless it is passed in the scrap function
  keepDriverAlive: false,
  // [optional] set to false if you dont want a dom check
  domCheck: {
    // [optional] to set the dom check count for equilibrium. defaults to 3
    equilibriumThreshold: 3, 
    // [optional] to set the sleep interval between checks. defaults to 1000
    interval: 1000, 
    // [optional] the timeout of the domCheck. defaults to 60000
    timeout: 10000 
  }
});

const { text, html, checks, equilibrium } = 
  await scrapper.scrap({
    url: // url you want to scrap
  });
console.log(equilibrium); // [boolean] true if equilibrium has been reach
console.log(checks);  // [number] the number of dom checks done
console.log(html); // [string] the html as of the last dom check
console.log(text);// [string] the body text as of the last dom check
```

## example manipulating the driver

```javascript
const { Scrapper } = require("simple-webdriver-scrapper");

const scrapper = new Scrapper({
  // [optional] option to disable javascript. defaults to false
  disableJavascript: false, 
  // [optional] for choosing the underlying browser. defaults to firefox
  browser: "firefox",
  // [optional] for choosing if the browser driver should be killed after the scrap ( if set to true you need to call driver.quit() in your code for a clean exit )
  // even with keepDriverAlive option set to true a new driver will get created unless it is passed in the scrap function
  keepDriverAlive: true,
  // [optional] set to false if you dont want a dom check
  domCheck: {
    // [optional] to set the dom check count for equilibrium. defaults to 3
    equilibriumThreshold: 3, 
    // [optional] to set the sleep interval between checks. defaults to 1000
    interval: 1000, 
    // [optional] the timeout of the domCheck. defaults to 60000
    timeout: 10000 
  }
});

const { text, html, checks, equilibrium, driver } = 
  await scrapper.scrap({
    url: // url you want to scrap
  });
// DO STUFF WITH driver like
// const text = await driver.executeScript(`return document.body.innerText;`);
// then you MUST call driver.quit() for a clean exit
driver.quit();
console.log(equilibrium); // [boolean] true if equilibrium has been reach
console.log(checks);  // [number] the number of dom checks done
console.log(html); // [string] the html as of the last dom check
console.log(text);// [string] the body text as of the last dom check

const { text2, html2, checks2, equilibrium2, driver } = 
  await scrapper.scrap({
    url: // url you want to scrap,
    driver // passing our manipulated driver posible for reusing the browser instance state
  });

```


