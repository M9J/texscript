export class Timer {
  async time(fn) {
    if (fn) {
      const startTime = performance.now();
      await fn();
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      return totalTime < 1000 ? `${totalTime.toFixed(3)}ms` : `${(totalTime / 1000).toFixed(3)}s`;
    }
  }
}
