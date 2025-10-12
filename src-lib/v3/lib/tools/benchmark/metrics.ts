

import ERRORS from "../../constants/errors";
import { updateSplashStatus } from "../../tools/dom/splash";


export default class Metrics {
  
  #metricsName: string | null = null;

  
  #startTime: DOMHighResTimeStamp | null = null;

  
  #endTime: DOMHighResTimeStamp | null = null;

  
  constructor(metricsName: string) {
    if (!metricsName) throw new Error(ERRORS.ERR0013);
    this.#metricsName = metricsName;
  }

  
  start(): void {
    this.#startTime = performance.now();
  }

  
  end(): void {
    this.#endTime = performance.now();
    const totalTime = this.getFormattedTime();
    const message = `[Texscript: Metrics] > ${this.#metricsName} finished in ${totalTime}`;
    console.log(message);
    updateSplashStatus(message);
  }

  
  getTotalTimeMilliseconds(): number {
    if (this.#endTime && this.#startTime) {
      return this.#endTime - this.#startTime;
    } else return 0;
  }

  
  getFormattedTime(): string {
    const ms = this.getTotalTimeMilliseconds();

    
    if (ms < 1000) {
      return `${ms.toFixed(3)}ms`;
    } else {
      
      return `${(ms / 1000).toFixed(3)}s`;
    }
  }
}
