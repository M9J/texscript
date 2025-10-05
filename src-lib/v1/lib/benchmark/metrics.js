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
    this.#startTime = performance.now();
  }

  end() {
    this.#endTime = performance.now();
    const totalTime = this.getFormattedTime();
    console.log(`[Texscript: Metrics] > ${this.#metricsName} finished in ${totalTime}`);
  }

  getTotalTimeMilliseconds() {
    return this.#endTime - this.#startTime;
  }

  getFormattedTime() {
    const ms = this.getTotalTimeMilliseconds();
    if (ms < 1000) {
      return `${ms.toFixed(3)}ms`;
    } else {
      return `${(ms / 1000).toFixed(3)}s`;
    }
  }
}
