import readline from "readline";

export class MemoManager {
  readLines() {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    return new Promise((resolve, reject) => {
      const lines = [];

      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        if (lines.length === 0) {
          resolve([]);
        } else {
          resolve(lines);
        }
      });

      rl.on("error", (err) => {
        reject(err);
      });
    });
  }
}

new MemoManager();
