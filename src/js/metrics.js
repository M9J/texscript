export default class Metrics {
  #START_TIME = null;
  #END_TIME = null;

  start() {
    this.#START_TIME = Date.now();
    console.log(`TEXScript > Compilation started`);
  }

  end() {
    this.#END_TIME = Date.now();
    const totalTime = this.getTotalTime();
    console.log(`TEXScript > Compilation finished in ${totalTime}`);
  }

  getTotalTime() {
    const totalTime = (this.#END_TIME - this.#START_TIME) / 1000;
    return `${totalTime}sec`;
  }
}
