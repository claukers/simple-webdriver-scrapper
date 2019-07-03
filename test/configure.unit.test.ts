import { expect } from "chai";
import { describe, it, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as rewiremock from 'rewiremock';
import * as path from "path";

describe("configure unit tests", function () {
  let lastDriver = null;
  this.timeout(60 * 1000);
  const fakeBuilder = {
  };
  const fakeFirefox = {
  };
  const fakeChrome= {
  };
  before((done) => {
    rewiremock.default.disable();
    rewiremock.default.enable();
    rewiremock.default.disable();
    rewiremock.default("selenium-webdriver").with({
      Builder: fakeBuilder
    });
    rewiremock.default("selenium-webdriver/chrome").with(fakeChrome);
    rewiremock.default("selenium-webdriver/firefox").with(fakeFirefox);
    rewiremock.default.enable();
    done();
  });
  after((done) => {
    rewiremock.default.disable();
    done();
  });
  
const defaultOptions = {
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
  
  const combinations = [
    {
      name: `all options are optional`,
      passing: {
        
      },
      expecting: defaultOptions
    },
    {
      name: `emptyscreen and change browser`,
      passing: {
        browser: "chrome",
        driverOptions: {
          screen: {
          }
        }
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      }
    },
    {
      name: `change screen and browser`,
      passing: {
        browser: "chrome",
        driverOptions: {
          screen: {
            width: 123,
            height: 321
          }
        }
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: 123,
            height: 321
          }
        }
      }
    },
    {
      name: `change headless and browser`,
      passing: {
        browser: "chrome",
        driverOptions: {
          headless: !defaultOptions.driverOptions.headless
        }
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: !defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      }
    },
    {
      name: `change timeout and browser`,
      passing: {
        browser: "chrome",
        domCheck: {
          timeout: 123
        }
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: 123,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      }
    },
    {
      name: `change equilibriumThreshold and browser`,
      passing: {
        browser: "chrome",
        domCheck: {
          equilibriumThreshold: 123
        }
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: 123,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      }
    },
    {
      name: `change keepDriverAlive and browser`,
      passing: {
        browser: "chrome",
        keepDriverAlive: !defaultOptions.keepDriverAlive
      },
      expecting: {
        disableJavascript: defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: !defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      } 
    },
    {
      name: `change browser and disableJavascript`,
      passing: {
        browser: "chrome",
        disableJavascript: !defaultOptions.disableJavascript
      },
      expecting: {
        disableJavascript: !defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      } 
    },
    {
      name: `disableJavascript only`,
      passing: {
        disableJavascript: !defaultOptions.disableJavascript
      },
      expecting: {
        disableJavascript: !defaultOptions.disableJavascript,
        browser: defaultOptions.browser,
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      },
      passing2: {
        browser: "chrome"
      },
      expecting2: {
        disableJavascript: !defaultOptions.disableJavascript,
        browser: "chrome",
        keepDriverAlive: defaultOptions.keepDriverAlive,
        domCheck: {
          equilibriumThreshold: defaultOptions.domCheck.equilibriumThreshold,
          timeout: defaultOptions.domCheck.timeout,
          interval: defaultOptions.domCheck.interval
        },
        driverOptions: {
          headless: defaultOptions.driverOptions.headless,
          screen: {
            width: defaultOptions.driverOptions.screen.width,
            height: defaultOptions.driverOptions.screen.height
          }
        }
      }
    }
  ];
  
  for(const combination of combinations) {
    it(`test case configure with ctr [${combination.name}]`, (done) => {
      const test = async () => {
        const lib = require("../src");
        const o = new lib.Scrapper(combination.passing);
        const actual = o.options;
        expect(actual.disableJavascript).to.be.equal(combination.expecting.disableJavascript);
        expect(actual.browser).to.be.equal(combination.expecting.browser);
        expect(actual.keepDriverAlive).to.be.equal(combination.expecting.keepDriverAlive);
        expect(actual.domCheck.equilibriumThreshold).to.be.equal(combination.expecting.domCheck.equilibriumThreshold);
        expect(actual.domCheck.timeout).to.be.equal(combination.expecting.domCheck.timeout);
        expect(actual.domCheck.interval).to.be.equal(combination.expecting.domCheck.interval);
        expect(actual.driverOptions.headless).to.be.equal(combination.expecting.driverOptions.headless);
        expect(actual.driverOptions.screen.width).to.be.equal(combination.expecting.driverOptions.screen.width);
        expect(actual.driverOptions.screen.height).to.be.equal(combination.expecting.driverOptions.screen.height);
      };
      test().then(done).catch(done);
    });
    const isTwoPass = combination.passing2 && combination.expecting2;
    it(`test case configure with configure method ${isTwoPass ? `two times `:""}with empty ctr args [${combination.name}]`, (done) => {
      const test = async () => {
        const lib = require("../src");
        const scrapper = new lib.Scrapper();
        scrapper.configure(combination.passing);
        const actual = scrapper.options;
        expect(actual.disableJavascript).to.be.equal(combination.expecting.disableJavascript);
        expect(actual.browser).to.be.equal(combination.expecting.browser);
        expect(actual.keepDriverAlive).to.be.equal(combination.expecting.keepDriverAlive);
        expect(actual.domCheck.equilibriumThreshold).to.be.equal(combination.expecting.domCheck.equilibriumThreshold);
        expect(actual.domCheck.timeout).to.be.equal(combination.expecting.domCheck.timeout);
        expect(actual.domCheck.interval).to.be.equal(combination.expecting.domCheck.interval);
        expect(actual.driverOptions.headless).to.be.equal(combination.expecting.driverOptions.headless);
        expect(actual.driverOptions.screen.width).to.be.equal(combination.expecting.driverOptions.screen.width);
        expect(actual.driverOptions.screen.height).to.be.equal(combination.expecting.driverOptions.screen.height);
        if(isTwoPass) {
          scrapper.configure(combination.passing2);
          const actual2 = scrapper.options;
          expect(actual2.disableJavascript).to.be.equal(combination.expecting2.disableJavascript);
          expect(actual2.browser).to.be.equal(combination.expecting2.browser);
          expect(actual2.keepDriverAlive).to.be.equal(combination.expecting2.keepDriverAlive);
          expect(actual2.domCheck.equilibriumThreshold).to.be.equal(combination.expecting2.domCheck.equilibriumThreshold);
          expect(actual2.domCheck.timeout).to.be.equal(combination.expecting2.domCheck.timeout);
          expect(actual2.domCheck.interval).to.be.equal(combination.expecting2.domCheck.interval);
          expect(actual2.driverOptions.headless).to.be.equal(combination.expecting2.driverOptions.headless);
          expect(actual2.driverOptions.screen.width).to.be.equal(combination.expecting2.driverOptions.screen.width);
          expect(actual2.driverOptions.screen.height).to.be.equal(combination.expecting2.driverOptions.screen.height);
        }
      };
      test().then(done).catch(done);
    });
  }
});
