import {EventEmitter} from "events";
import {Builder} from "selenium-webdriver";
/* tslint:disable */
import * as chrome from "selenium-webdriver/chrome";
import * as firefox from "selenium-webdriver/firefox";

/* tslint:enable */

export interface IScrapperOptions {
  disableJavascript?: boolean;
  browser?: "firefox" | "chrome";
  keepDriverAlive?: boolean;
  domCheck?: {
    equilibriumThreshold?: number;
    timeout?: number;
    interval?: number;
  };
  driverOptions?: {
    headless?: boolean;
    screen?: {
      width?: number;
      height?: number;
    }
  };
}

export interface IScrapOptions {
  url: string;
  driver?: any;
}

export interface IScrapResult {
  equilibrium: boolean;
  text: string;
  checks: number;
  html: string;
  driver: any;
}

export const newDefaultOptions = () => {
  const defaultOptions: IScrapperOptions = {
    disableJavascript: false,
    browser: "firefox",
    keepDriverAlive: false,
    domCheck: {
      equilibriumThreshold: 3,
      timeout: 60000,
      interval: 1000
    },
    driverOptions: {
      headless: true,
      screen: {
        width: 1920,
        height: 1080
      }
    }
  };
  return defaultOptions;
};

export class Scrapper extends EventEmitter {
  public options: IScrapperOptions;

  public constructor(options?: IScrapperOptions) {
    super();
    this.options = newDefaultOptions();
    this.configure(options);
  }

  public configure(cfg?: IScrapperOptions) {
    const baseOptions = this.options;
    if (!cfg) {
      cfg = baseOptions;
    }
    if (cfg.disableJavascript === undefined) {
      cfg.disableJavascript = baseOptions.disableJavascript;
    }
    if (cfg.browser === undefined) {
      cfg.browser = baseOptions.browser;
    }
    if (cfg.keepDriverAlive === undefined) {
      cfg.keepDriverAlive = baseOptions.keepDriverAlive;
    }
    if (cfg.domCheck === undefined) {
      cfg.domCheck = baseOptions.domCheck;
    } else if (cfg.domCheck) {
      if (cfg.domCheck.equilibriumThreshold === undefined) {
        cfg.domCheck.equilibriumThreshold = baseOptions.domCheck.equilibriumThreshold;
      }
      if (cfg.domCheck.timeout === undefined) {
        cfg.domCheck.timeout = baseOptions.domCheck.timeout;
      }
      if (cfg.domCheck.interval === undefined) {
        cfg.domCheck.interval = baseOptions.domCheck.interval;
      }
    }
    if (cfg.driverOptions === undefined) {
      cfg.driverOptions = baseOptions.driverOptions;
    } else if (cfg.driverOptions) {
      if (cfg.driverOptions.headless === undefined) {
        cfg.driverOptions.headless = baseOptions.driverOptions.headless;
      }
      if (cfg.driverOptions.screen === undefined) {
        cfg.driverOptions.screen = baseOptions.driverOptions.screen;
      } else if (cfg.driverOptions.screen) {
        if (cfg.driverOptions.screen.width === undefined) {
          cfg.driverOptions.screen.width = baseOptions.driverOptions.screen.width;
        }
        if (cfg.driverOptions.screen.height === undefined) {
          cfg.driverOptions.screen.height = baseOptions.driverOptions.screen.height;
        }
      }
    }
    this.options = cfg;
  }

  public async getDriver() {
    const firefoxOptions =
      (this.options.driverOptions.headless ? new firefox.Options().headless() : new firefox.Options())
        .windowSize(this.options.driverOptions.screen);
    firefoxOptions.setPreference("javascript.enabled", !this.options.disableJavascript);
    return new Builder().forBrowser(this.options.browser)
      .setChromeOptions(
        (this.options.driverOptions.headless ? new chrome.Options().headless() : new chrome.Options())
          .windowSize(this.options.driverOptions.screen))
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  public async scrap(options: IScrapOptions): Promise<IScrapResult> {
    if (!options.url && !options.driver) {
      throw new Error("not passing driver and url is not allowed!");
    }
    const driver = !options.driver ? await this.getDriver() : options.driver;
    try {
      if (options.url) {
        await driver.get(options.url);
      }
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
      if (!this.options.keepDriverAlive) {
        await driver.quit();
      }
      return lastResult;
    } catch (e) {
      this.emit("error", e);
      try {
        await driver.quit();
      } catch (e) {
        this.emit("error", e);
      }
      throw e;
    }
  }

  private async sleep(ms: number) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  // noinspection JSMethodCanBeStatic
  private async updateResult(driver: any, lastResult: IScrapResult): Promise<IScrapResult> {
    const html = await driver.getPageSource();
    const text = await driver.executeScript(`return document.body.innerText;`);
    return {
      html,
      checks: lastResult ? lastResult.checks + 1 : 1,
      driver,
      equilibrium: lastResult ? html === lastResult.html && text === lastResult.text : false,
      text
    };
  }
}
