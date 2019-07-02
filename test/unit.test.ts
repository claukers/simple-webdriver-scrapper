import { expect } from "chai";
import { describe, it, before, after } from 'mocha';
import * as sinon from 'sinon';
import * as rewiremock from 'rewiremock';
import * as path from "path";

describe("unit tests", function () {
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
  it("passing driver to scrap uses that driver", (done) => {
    const test = async () => {
      const lib = require("../src");
    };
    test().then(done).catch(done);
  });
  it("keepdriveralive true doesnt call quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
    };
    test().then(done).catch(done);
  });
  it("keepdriveralive false calls quit on driver", (done) => {
    const test = async () => {
      const lib = require("../src");
    };
    test().then(done).catch(done);
  });
  it("not passing driver to scrap creates a new driver", (done) => {
    const test = async () => {
      const lib = require("../src");
    };
    test().then(done).catch(done);
  });
})
