import type { LoadedConfig, QualityOSInput, QualityOSResult } from "./types.js";
import { loadConfig } from "./loader.js";
import { QualityOSRuntime } from "./engine.js";

export class QualityOS {
  private rt: QualityOSRuntime;

  private constructor(cfg: LoadedConfig) {
    this.rt = new QualityOSRuntime(cfg);
  }

  static async create(opts: { configDir: URL | string }): Promise<QualityOS> {
    const cfg = await loadConfig(opts.configDir);
    return new QualityOS(cfg);
  }

  run(input: QualityOSInput): QualityOSResult {
    return this.rt.run(input);
  }
}
