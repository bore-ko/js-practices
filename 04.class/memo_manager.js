import fs from "node:fs/promises";
import readline from "readline";

export class MemoManager {
  async isAccessible(fileLocation) {
    try {
      await fs.access(fileLocation);
      return true;
    } catch (err) {
      if (err.code == "ENOENT") {
        return false;
      } else {
        console.error(err);
      }
    }
  }

  async read(fileLocation) {
    try {
      const data = await fs.readFile(fileLocation, "utf8");
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async write(fileLocation, data) {
    try {
      await fs.writeFile(fileLocation, data, "utf8");
    } catch (err) {
      console.error(err);
    }
  }

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
