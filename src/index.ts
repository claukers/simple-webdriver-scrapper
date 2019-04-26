import { Builder } from "selenium-webdriver";
/* tslint:disable */
import * as chrome from "selenium-webdriver/chrome";
import * as firefox from "selenium-webdriver/firefox";
/* tslint:enable */

export interface IScrapperOptions {
  disableJavascript?: boolean;
  browser?: "firefox" | "chrome";
  domCheck?: {
    equilibriumThreshold: number;
    timeout: number;
    interval: number;
  };
}

export interface IScrapOptions {
  url: string;
}

export interface IScrapResult {
  equilibrium: boolean;
  text: string;
  checks: number;
  html: string;
  driver: any;
}

export const defaultOptions: IScrapperOptions = {
  disableJavascript: false,
  browser: "firefox",
  domCheck: {
    equilibriumThreshold: 3,
    timeout: 60000,
    interval: 1000
  }
};

export class Scrapper {
  public constructor(public options?: IScrapperOptions) {
    if (!options) {
      this.options = defaultOptions;
    }
    if (this.options.browser === undefined) {
      this.options.browser = defaultOptions.browser;
    }
    if (this.options.domCheck === undefined) {
      this.options.domCheck = defaultOptions.domCheck;
    } else if (this.options.domCheck) {
      if (this.options.domCheck.equilibriumThreshold === undefined) {
        this.options.domCheck.equilibriumThreshold = defaultOptions.domCheck.equilibriumThreshold;
      }
      if (this.options.domCheck.timeout === undefined) {
        this.options.domCheck.timeout = defaultOptions.domCheck.timeout;
      }
      if (this.options.domCheck.interval === undefined) {
        this.options.domCheck.interval = defaultOptions.domCheck.interval;
      }
    }
  }
  public async getDriver() {
    const screen = {
      width: 640,
      height: 480
    };
    const driver = await new Builder().forBrowser(this.options.browser)
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
      .build();
    return driver;
  }
  public async scrap(options: IScrapOptions): Promise<IScrapResult> {
    const driver = await this.getDriver();
    await driver.get(options.url);
    let equilibriumCount = 0;
    let lastResult = null;
    const stopMS = this.options.domCheck.timeout + new Date().getTime();
    const loop = async () => {
      while (
        new Date().getTime() < stopMS &&
        equilibriumCount < this.options.domCheck.equilibriumThreshold
      ) {
        await this.sleep(this.options.domCheck.interval);
        const result = await this.updateResult(driver, lastResult);
        if (result.equilibrium) {
          equilibriumCount++;
        }
        lastResult = result;
      }
      return lastResult;
    };
    if (this.options.domCheck) {
      await loop();
    } else {
      lastResult = await this.updateResult(driver, lastResult);
    }
    await driver.quit();
    return lastResult;
  }
  private async sleep(ms: number) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
  private async updateResult(driver: any, lastResult: IScrapResult): Promise<IScrapResult> {
    const html = await driver.getPageSource();
    const text = await driver.executeScript(`return document.body.innerText;`);
    const ret = {
      html,
      checks: lastResult ? lastResult.checks + 1 : 1,
      driver,
      equilibrium: lastResult ? html === lastResult.html && text === lastResult.text : false,
      text
    };
    return ret;
  }
}
