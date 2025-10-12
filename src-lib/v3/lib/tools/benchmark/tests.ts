import Compiler from "../../compiler/compiler";

export function averageCompilationGenerationTime(rawCode: string): void {
  console.log("EXP: Started");

  const compilationTimes = [];
  const compiler = new Compiler();

  for (let i = 0; i < 99999; i++) {
    compiler.compile(rawCode);
    const compilationTime = compiler.metrics.getTotalTimeMilliseconds();
    compilationTimes.push(compilationTime);
  }

  const compilationTimeSum = compilationTimes.reduce((p, c) => (p += c));
  const totalCompilationTime = compilationTimeSum / compilationTimes.length;
  const tct = totalCompilationTime;
  console.log("tct", tct);
  
  console.log("EXP: Ended");
}
