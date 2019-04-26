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
  // [optional] set to false if you dont want a dom 
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


