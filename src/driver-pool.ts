import * as genericPool from "generic-pool";
import {Scrapper} from "./scrapper";

export const DriverPool = (opts, scrapper: Scrapper) => {
  const factory = {
    create: () => {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(await scrapper.getDriver());
        } catch (e) {
          reject(e);
        }
      });
    },
    destroy: (instance) => {
      return new Promise(async (resolve, reject) => {
        try {
          await instance.quit();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },
    validate: (instance) => {
      return new Promise((resolve) => {
        resolve(true);
      });
    }
  };
  return genericPool.createPool(factory, opts);
};
