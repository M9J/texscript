/**
 * Performance Metrics Utility
 *
 * Provides a simple interface for measuring and reporting the execution time
 * of operations within Texscript. Uses the high-resolution Performance API
 * to capture precise timing measurements.
 *
 * @module metrics
 * @example
 * const metrics = new Metrics("Document Parsing");
 * metrics.start();
 * // ... perform operation ...
 * metrics.end(); // Logs: "[Texscript: Metrics] > Document Parsing finished in 145.234ms"
 */

import ERRORS from "../constants/errors";

/**
 * A class for tracking and reporting performance metrics of named operations.
 *
 * This class uses the Performance API to capture high-resolution timestamps,
 * providing microsecond-level precision for performance measurements. It's
 * designed for development and debugging to identify performance bottlenecks.
 *
 * @class Metrics
 */
export default class Metrics {
  /** The descriptive name of the operation being measured */
  #metricsName: string | null = null;

  /** High-resolution timestamp when the operation started */
  #startTime: DOMHighResTimeStamp | null = null;

  /** High-resolution timestamp when the operation ended */
  #endTime: DOMHighResTimeStamp | null = null;

  /**
   * Creates a new Metrics instance for tracking a named operation.
   *
   * @param {string} metricsName - A descriptive name for the operation being measured.
   *                               Used in console output to identify the metric.
   * @throws {Error} Throws ERR0013 if metricsName is empty or undefined
   *
   * @example
   * const parseMetrics = new Metrics("AST Generation");
   */
  constructor(metricsName: string) {
    if (!metricsName) throw new Error(ERRORS.ERR0013);
    this.#metricsName = metricsName;
  }

  /**
   * Starts the performance measurement timer.
   *
   * Captures the current high-resolution timestamp using performance.now().
   * This should be called immediately before the operation to be measured.
   *
   * @returns {void}
   *
   * @example
   * const metrics = new Metrics("Compilation");
   * metrics.start();
   * compile();
   */
  start(): void {
    this.#startTime = performance.now();
  }

  /**
   * Ends the performance measurement and logs the result.
   *
   * Captures the end timestamp, calculates the total elapsed time,
   * and outputs a formatted message to the console with the operation
   * name and duration.
   *
   * @returns {void}
   *
   * @example
   * metrics.end();
   * // Console output: "[Texscript: Metrics] > Compilation finished in 1.234s"
   */
  end(): void {
    this.#endTime = performance.now();
    const totalTime = this.getFormattedTime();
    console.log(`[Texscript: Metrics] > ${this.#metricsName} finished in ${totalTime}`);
  }

  /**
   * Calculates the total elapsed time in milliseconds.
   *
   * Returns the difference between the end and start timestamps.
   * If either timestamp is missing (measurement not started or ended),
   * returns 0 as a safe default.
   *
   * @returns {number} The elapsed time in milliseconds, or 0 if measurement is incomplete
   *
   * @example
   * const elapsed = metrics.getTotalTimeMilliseconds();
   * console.log(`Operation took ${elapsed}ms`);
   */
  getTotalTimeMilliseconds(): number {
    if (this.#endTime && this.#startTime) {
      return this.#endTime - this.#startTime;
    } else return 0;
  }

  /**
   * Formats the elapsed time as a human-readable string.
   *
   * Automatically selects the appropriate unit (milliseconds or seconds)
   * based on the duration:
   * - Operations under 1000ms are displayed in milliseconds
   * - Operations over 1000ms are displayed in seconds
   *
   * All values are formatted to 3 decimal places for consistency.
   *
   * @returns {string} Formatted time string with appropriate unit (e.g., "45.123ms" or "2.456s")
   *
   * @example
   * const formatted = metrics.getFormattedTime();
   * // Returns: "145.234ms" or "1.523s"
   */
  getFormattedTime(): string {
    const ms = this.getTotalTimeMilliseconds();

    // Use milliseconds for durations under 1 second
    if (ms < 1000) {
      return `${ms.toFixed(3)}ms`;
    } else {
      // Convert to seconds for longer durations
      return `${(ms / 1000).toFixed(3)}s`;
    }
  }
}
