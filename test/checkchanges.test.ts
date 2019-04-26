import { expect } from "chai";
import { describe, it } from "mocha";
import * as path from "path";

describe("check changes", function () {
  this.timeout(60 * 1000);
  it("interval30s.html with domcheck's timeout of 10s should return text=10 with equilibrium failed", (done) => {
    const filePath = path.resolve(__dirname, "data", "interval30s.html");
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: {
          timeout: 10000
        }
      });
      await scrapper.init();
      const result = await scrapper.scrap({
        url: "file://" + filePath
      });
      expect(result.equilibrium).to.be.equals(false);
      expect(result.text).to.be.equals('10');
      expect(result.checks).to.be.equals(10);
      expect(result.html.length).to.be.equals(331);
      expect(result.driver).to.not.be.equal(null);
      await scrapper.dispose();
    };
    test().then(done).catch(done);
  });
  it("interval30s.html with domcheck's timeout of 35s should return text=30 with equilibrium true", (done) => {
    const filePath = path.resolve(__dirname, "data", "interval30s.html");
    const test = async () => {
      const lib = require("../src");
      const scrapper = new lib.Scrapper({
        domCheck: {
          timeout: 35000
        }
      });
      await scrapper.init();
      const result = await scrapper.scrap({
        url: "file://" + filePath
      });
      expect(result.equilibrium).to.be.equals(true);
      expect(result.text).to.be.equals('30');
      expect(result.checks).to.be.equals(33);
      expect(result.html.length).to.be.equals(331);
      expect(result.driver).to.not.be.equal(null);
      await scrapper.dispose();
    };
    test().then(done).catch(done);
  });
})
