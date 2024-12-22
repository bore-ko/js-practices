import * as fs from "node:fs/promises";

export class FileOperation {
  async access(file) {
    try {
      await fs.access(file);
      return true;
    } catch {
      return false;
    }
  }

  async read(file) {
    try {
      const data = await fs.readFile(file, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async write(file, data) {
    try {
      await fs.writeFile(file, data, "utf8");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

new FileOperation();
