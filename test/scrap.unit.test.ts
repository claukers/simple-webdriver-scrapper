import { expect } from "chai";
import { describe, it, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as rewiremock from 'rewiremock';
import * as path from "path";

describe("scrap unit tests", function () {
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
  it("driver.get throws and driver.quit throws is handled", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false
      });
      let errorsEmitted = 0;
      scrapper.on("error", (e)=>{
        expect(e.message).to.be.equals("bla");
        errorsEmitted++;
      });
      await new Promise((resolve, reject) => {
        scrapper.scrap({
          driver: {
            get: sinon.fake(async (url)=> {
              expect(url).to.be.equal("url");
              throw new Error("bla");
            }),
            quit: sinon.fake(async ()=> {
              throw new Error("bla");
            })
          },
          url: "url"
        }).then(()=>{
          reject(new Error("bad state"));
        }).catch((e)=>{
          try {
            expect(e.message).to.be.equals("bla");
            expect(errorsEmitted).to.be.equal(2);
            resolve();
          } catch(e) {
            reject(e);
          }
        });
      });
    };
    test().then(done).catch(done);
  });
  it("driver.get throws is handled", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false
      });
      let errorsEmitted = 0;
      scrapper.on("error", (e)=>{
        expect(e.message).to.be.equals("get bla");
        errorsEmitted++;
      });
      await new Promise((resolve, reject) => {
        scrapper.scrap({
          driver: {
            get: sinon.fake(async (url)=> {
              expect(url).to.be.equal("url");
              throw new Error("get bla");
            }),
            quit: sinon.fake(async ()=> {
            })
          },
          url: "url"
        }).then(()=>{
          reject(new Error("bad state"));
        }).catch((e)=>{
          try {
            expect(e.message).to.be.equals("get bla");
            expect(errorsEmitted).to.be.equal(1);
            resolve();
          } catch(e) {
            reject(e);
          }
        });
      });
    };
    test().then(done).catch(done);
  });
  it("not passing driver and no url is not allowed", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false
      });
      try {
        const result = await scrapper.scrap({
        });
        throw new Error("bad state");
      } catch(e) {
        expect(e.message).to.be.equals("not passing driver and url is not allowed!");
      }
    };
    test().then(done).catch(done);
  });
  it("keepDriverAlive true passing driver and no url to scrap uses that driver and ignores get call and doesnt call quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false,
        keepDriverAlive: true
      });
      scrapper.updateResult = sinon.fake(async (driver, lastResult)=> {
        return {
          driver,
          text: "bla",
          equilibrium: false,
          checks: 1,
          html: "html"
        }
      });
      const updateResultCount = scrapper.updateResult.callCount;
      await scrapper.scrap({
        driver: {
          
        }
      }).catch((e)=>{
        console.error(e);
        throw e;
      });
      expect(updateResultCount+1).to.be.equal(scrapper.updateResult.callCount);
    };
    test().then(done).catch(done);
  });
  it("keepDriverAlive false passing driver and no url to scrap uses that driver and ignores get call and does call quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false,
        keepDriverAlive: false
      });
      scrapper.updateResult = sinon.fake(async (driver, lastResult)=> {
        return {
          driver,
          text: "bla",
          equilibrium: false,
          checks: 1,
          html: "html"
        }
      });
      const driver = {
        quit: sinon.fake(async ()=> {
          return;
        })
      };
      const updateResultCount = scrapper.updateResult.callCount;
      const quitCount= driver.quit.callCount;
      await scrapper.scrap({
        driver
      }).catch((e)=>{
        console.error(e);
        throw e;
      });
      expect(updateResultCount+1).to.be.equal(scrapper.updateResult.callCount);
      expect(quitCount+1).to.be.equal(driver.quit.callCount);
    };
    test().then(done).catch(done);
  });
  it("keepDriverAlive true not passing driver and url to scrap uses gets a new driver calls get and doesnt call quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false,
        keepDriverAlive: true
      });
      scrapper.updateResult = sinon.fake(async (driver, lastResult)=> {
        return {
          driver,
          text: "bla",
          equilibrium: false,
          checks: 1,
          html: "html"
        }
      });
      const driver = {
        get: sinon.fake(async (url)=> {
          expect(url).to.be.equal("url");
        })
      };
      scrapper.getDriver = sinon.fake(async ()=> {
        return driver;
      });
      const updateResultCount = scrapper.updateResult.callCount;
      const getDriverCount = scrapper.getDriver.callCount;
      const getCount = driver.get.callCount;
      const url = "url";
      await scrapper.scrap({
        url
      }).catch((e)=>{
        console.error(e);
        throw e;
      });
      expect(updateResultCount+1).to.be.equal(scrapper.updateResult.callCount);
      expect(getDriverCount+1).to.be.equal(scrapper.getDriver.callCount);
      expect(getCount+1).to.be.equal( driver.get.callCount);
    };
    test().then(done).catch(done);
  });
  it("keepDriverAlive false not passing driver and url to scrap uses gets a new driver calls get and does call quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: false,
        keepDriverAlive: false
      });
      scrapper.updateResult = sinon.fake(async (driver, lastResult)=> {
        return {
          driver,
          text: "bla",
          equilibrium: false,
          checks: 1,
          html: "html"
        }
      });
      const driver = {
        get: sinon.fake(async (url)=> {
          expect(url).to.be.equal("url");
        }),
        quit: sinon.fake(async ()=> {
        })
      };
      scrapper.getDriver = sinon.fake(async ()=> {
        return driver;
      });
      const updateResultCount = scrapper.updateResult.callCount;
      const getDriverCount = scrapper.getDriver.callCount;
      const getCount = driver.get.callCount;
      const quitCount = driver.quit.callCount;
      const url = "url";
      await scrapper.scrap({
        url
      }).catch((e)=>{
        console.error(e);
        throw e;
      });
      expect(updateResultCount+1).to.be.equal(scrapper.updateResult.callCount);
      expect(getDriverCount+1).to.be.equal(scrapper.getDriver.callCount);
      expect(getCount+1).to.be.equal( driver.get.callCount);
      expect(quitCount+1).to.be.equal( driver.quit.callCount);
    };
    test().then(done).catch(done);
  });
})
