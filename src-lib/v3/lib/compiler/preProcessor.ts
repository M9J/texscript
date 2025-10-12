import ERRORS from "../constants/errors";
import Metrics from "../tools/benchmark/metrics";

export default class PreProcessor {
  private metrics = new Metrics("PrePrecessor");
  private rawCode: string = "";

  constructor(rawCode: string) {
    if (!rawCode) throw new Error(ERRORS.ERR0002);
    this.rawCode = rawCode;
  }

  preprocessCode(): string[] {
    this.metrics.start();
    const trimmedCode = this.trim(this.rawCode);
    const normalizedCode = this.normalize(trimmedCode);
    const characterStream = this.convertToCharacterStream(normalizedCode);
    this.metrics.end();
    return characterStream;
  }

  private convertToCharacterStream(code: string) {
    return code.split("");
  }

  private normalize(code: string) {
    return code.replace(/\r/gi, "");
  }

  private trim(code: string) {
    return code.trim();
  }
}
