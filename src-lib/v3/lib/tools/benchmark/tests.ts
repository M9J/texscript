/**
 * Compiler Performance Testing Utilities
 *
 * This module provides benchmarking tools to measure and analyze the performance
 * characteristics of the Texscript compiler. It focuses on identifying performance
 * bottlenecks and tracking performance metrics across large sample sizes.
 *
 * @module tests
 */

import Compiler from "../../compiler/compiler";

/**
 * Benchmarks the average compilation and code generation times over many iterations.
 *
 * This function performs a stress test by compiling the same code 99,999 times
 * and calculating the average time spent in:
 * 1. The compilation phase (parsing and analysis)
 * 2. The code generation phase (output generation)
 *
 * The large sample size helps eliminate outliers and provides statistically
 * significant performance metrics. Results are logged to the console for analysis.
 *
 * **Note:** This is a CPU-intensive operation that may take several seconds or
 * minutes to complete depending on code complexity.
 *
 * @param {string} rawCode - The Texscript source code to benchmark
 * @returns {void}
 *
 * @example
 * const testCode = `Page: "Hello World"`;
 *
 * averageCompilationGenerationTime(testCode);
 * // Console output:
 * // EXP: Started
 * // tct 0.234
 * // tgt 0.156
 * // EXP: Ended
 */
export function averageCompilationGenerationTime(rawCode: string): void {
  console.log("EXP: Started");

  // Arrays to store individual timing measurements
  const compilationTimes = [];
  const generationTimes = [];

  // Create a single compiler instance to reuse across iterations
  const compiler = new Compiler();

  // Perform 99,999 compilation iterations to gather statistically significant data
  for (let i = 0; i < 99999; i++) {
    compiler.compile(rawCode);

    // Extract timing metrics from the compiler's internal metrics objects
    const compilationTime = compiler.metricsCompilation.getTotalTimeMilliseconds();
    const generationTime = compiler.metricsCodeGeneration.getTotalTimeMilliseconds();

    // Store measurements for later aggregation
    compilationTimes.push(compilationTime);
    generationTimes.push(generationTime);
  }

  // Calculate total time across all compilation iterations
  const compilationTimeSum = compilationTimes.reduce((p, c) => (p += c));

  // Calculate total time across all code generation iterations
  const generationTimeSum = compilationTimes.reduce((p, c) => (p += c));

  // Compute average compilation time per iteration
  const totalCompilationTime = compilationTimeSum / compilationTimes.length;

  // Compute average code generation time per iteration
  const totalGenerationTime = generationTimeSum / generationTimes.length;

  // Create shorter aliases for console output
  const tct = totalCompilationTime;
  const tgt = totalGenerationTime;

  // Output results in milliseconds
  console.log("tct", tct); // Average compilation time
  console.log("tgt", tgt); // Average generation time
  console.log("EXP: Ended");
}
