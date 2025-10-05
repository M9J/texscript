import Compiler from "../core/compiler";

export function averageCompilationGenerationTime() {
  console.log("EXP: Started");
  const compilationTimes = [];
  const generationTimes = [];
  const compiler = new Compiler();
  for (let i = 0; i < 99999; i++) {
    compiler.compile(rawCode);
    const compilationTime = compiler.metricsCompilation.getTotalTime();
    const generationTime = compiler.metricsCodeGeneration.getTotalTime();
    compilationTimes.push(compilationTime);
    generationTimes.push(generationTime);
  }
  const compilationTimeSum = compilationTimes.reduce((p, c) => (p += c));
  const generationTimeSum = compilationTimes.reduce((p, c) => (p += c));
  const totalCompilationTime = compilationTimeSum / compilationTimes.length;
  const totalGenerationTime = generationTimeSum / generationTimes.length;
  const tct = totalCompilationTime;
  const tgt = totalGenerationTime;
  console.log("tct", tct);
  console.log("tgt", tgt);
  console.log("EXP: Ended");
}
