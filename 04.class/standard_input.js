import { createInterface } from "readline/promises";
import { once } from "events";

export class StandardInput {
  async readLines() {
    const rl = createInterface({ input: process.stdin });
    const lines = [];

    rl.on("line", (line) => {
      lines.push(line);
    });

    await once(rl, "close");
    return lines;
  }
}
