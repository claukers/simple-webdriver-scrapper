import { expect } from "chai";
import { describe, it, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as rewiremock from 'rewiremock';
import * as path from "path";

describe("getdriver unit tests", function () {
  let lastDriver = null;
  let fheadlessCalledCount = 0;
  let fwindowSizeCalledCount = 0
  let fwindowSizeArg = undefined;
  let cheadlessCalledCount = 0;
  let cwindowSizeCalledCount = 0
  let cwindowSizeArg = undefined;
  this.timeout(60 * 1000);
  const fakeBuilder = class FakeBuilder {
    forBrowser() {
      return this;
    }
    setFirefoxOptions() {
      return this;
    }
    setChromeOptions() {
      return this;
    }
    build() {
      return this;
    }
  }
  const fakeFirefox = {
    Options: class FakeOptionsFirefox {
      headless(){
        fheadlessCalledCount++;
        return this;
      }
      setPreference(key, value) {
        return this;
      }
      windowSize(arg){
        fwindowSizeCalledCount++;
        fwindowSizeArg = arg;
        return this;
      }
    }
  };
  const fakeChrome= {
    Options: class FakeOptionsChrome {
      headless(){
        cheadlessCalledCount++;
        return this;
      }
      windowSize(arg){
        cwindowSizeCalledCount++;
        cwindowSizeArg = arg;
        return this;
      }
    }
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
  it("firefox getdriver uses headless and custom screen", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper();
      scrapper.options.driverOptions.headless = true;
      scrapper.options.driverOptions.screen = {
        width: 12,
        height: 13
      };
      fheadlessCalledCount = 0;
      fwindowSizeCalledCount = 0;
      fwindowSizeArg = undefined;
      await scrapper.getDriver();
      expect(fheadlessCalledCount).to.be.equal(1);
      expect(fwindowSizeCalledCount).to.be.equal(1);
      expect(fwindowSizeArg.width).to.be.equal(12);
      expect(fwindowSizeArg.height).to.be.equal(13);
    };
    test().then(done).catch(done);
  });
  it("firefox getdriver uses headless false and custom screen", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper();
      scrapper.options.driverOptions.headless = false;
      scrapper.options.driverOptions.screen = {
        width: 12,
        height: 13
      };
      fheadlessCalledCount = 0;
      fwindowSizeCalledCount = 0;
      fwindowSizeArg = undefined;
      await scrapper.getDriver();
      expect(fheadlessCalledCount).to.be.equal(0);
      expect(fwindowSizeCalledCount).to.be.equal(1);
      expect(fwindowSizeArg.width).to.be.equal(12);
      expect(fwindowSizeArg.height).to.be.equal(13);
    };
    test().then(done).catch(done);
  });
  it("chrome getdriver uses headless and custom screen", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper();
      scrapper.options.browser = "chrome";
      scrapper.options.driverOptions.headless = true;
      scrapper.options.driverOptions.screen = {
        width: 12,
        height: 13
      };
      cheadlessCalledCount = 0;
      cwindowSizeCalledCount = 0;
      cwindowSizeArg = undefined;
      await scrapper.getDriver();
      expect(cheadlessCalledCount).to.be.equal(1);
      expect(cwindowSizeCalledCount).to.be.equal(1);
      expect(cwindowSizeArg.width).to.be.equal(12);
      expect(cwindowSizeArg.height).to.be.equal(13);
    };
    test().then(done).catch(done);
  });
  it("chrome getdriver uses headless false and custom screen", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper();
      scrapper.options.browser = "chrome";
      scrapper.options.driverOptions.headless = false;
      scrapper.options.driverOptions.screen = {
        width: 12,
        height: 13
      };
      cheadlessCalledCount = 0;
      cwindowSizeCalledCount = 0;
      cwindowSizeArg = undefined;
      await scrapper.getDriver();
      expect(cheadlessCalledCount).to.be.equal(0);
      expect(cwindowSizeCalledCount).to.be.equal(1);
      expect(cwindowSizeArg.width).to.be.equal(12);
      expect(cwindowSizeArg.height).to.be.equal(13);
    };
    test().then(done).catch(done);
  });
});
