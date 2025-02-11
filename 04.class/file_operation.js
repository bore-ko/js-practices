import fs from "node:fs/promises";

export class FileOperation {
  async isAccess(file_location) {
    try {
      await fs.access(file_location);
      return true;
    } catch (err) {
      if (err.code == "ENOENT") {
        return false;
      } else {
        console.error(err);
      }
    }
  }

  async read(file_location) {
    try {
      const data = await fs.readFile(file_location, "utf8");
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async write(file_location, data) {
    try {
      await fs.writeFile(file_location, data, "utf8");
    } catch (err) {
      console.error(err);
    }
  }
}

new FileOperation();
