import ERRORS from "../constants/errors.js";

export default class Metrics {
  #metricsName = null;
  #startTime = null;
  #endTime = null;

  constructor(metricsName) {
    if (!metricsName) throw new Error(ERRORS.ERR0013);
    this.#metricsName = metricsName;
  }

  start() {
    this.#startTime = Date.now();
    console.log(`[TEXScript: Metrics] > ${this.#metricsName} started`);
  }

  end() {
    this.#endTime = Date.now();
    const totalTime = this.getTotalTimeInSeconds();
    console.log(`[TEXScript: Metrics] > ${this.#metricsName} finished in ${totalTime}`);
  }

  getTotalTime() {
    return this.#endTime - this.#startTime;
  }

  getTotalTimeInSeconds() {
    return `${this.getTotalTime() / 1000} seconds`;
  }
}
