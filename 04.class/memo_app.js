import fs from "node:fs/promises";
import { createInterface } from "readline/promises";
import { once } from "events";
import { randomUUID } from "crypto";
import enquirer from "enquirer";

export default class MemoApp {
  #option;
  #fileLocation;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
  }

  operate() {
    if (this.#option === "-l") {
      this.#list();
    } else if (this.#option === "-r") {
      this.#refer();
    } else if (this.#option === "-d") {
      this.#delete();
    } else {
      this.#add();
    }
  }

  async #list() {
    try {
      await this.#checkExistenceMemo(this.#fileLocation);
    } catch (error) {
      if (error.message === "File not found.") {
        console.error(error.message);
        return;
      }
      throw error;
    }

    const memos = await this.#readMemoObjectFromFile(this.#fileLocation);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    }

    memos.forEach((memo) => {
      console.log(memo.lines[0]);
    });
  }

  async #refer() {
    try {
      await this.#checkExistenceMemo(this.#fileLocation);
    } catch (error) {
      if (error.message === "File not found.") {
        console.error(error.message);
        return;
      }
      throw error;
    }

    const memos = await this.#readMemoObjectFromFile(this.#fileLocation);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    }

    try {
      const selectedMemo = await this.#selectMemo(memos, "see");
      console.log(selectedMemo.lines.join("\n"));
    } catch (error) {
      if (error === "") {
        console.error("program termination.");
      } else {
        throw error;
      }
    }
  }

  async #delete() {
    try {
      await this.#checkExistenceMemo(this.#fileLocation);
    } catch (error) {
      if (error.message === "File not found.") {
        console.error(error.message);
        return;
      }
      throw error;
    }

    const memos = await this.#readMemoObjectFromFile(this.#fileLocation);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    }

    let filteredMemos;
    try {
      const selectedMemo = await this.#selectMemo(memos, "delete");
      filteredMemos = memos.filter((memo) => memo.id !== selectedMemo.id);
    } catch (error) {
      if (error === "") {
        console.error("program termination.");
        return;
      } else {
        throw error;
      }
    }

    await this.#writeMemoToFile(filteredMemos, this.#fileLocation);
  }

  async #add() {
    let memos;
    try {
      memos = await this.#readMemoObjectFromFile(this.#fileLocation);
    } catch (error) {
      if (error.code === "ENOENT") {
        memos = [];
      } else {
        throw error;
      }
    }

    const lines = await this.#readLines();
    memos.push({ id: randomUUID(), lines });
    await this.#writeMemoToFile(memos, this.#fileLocation);
  }

  async #checkExistenceMemo(fileLocation) {
    try {
      await fs.access(fileLocation);
    } catch {
      throw new Error("File not found.");
    }
  }

  async #readMemoObjectFromFile(fileLocation) {
    const json = await fs.readFile(fileLocation, "utf8");
    const memos = JSON.parse(json);
    if (memos.length === 0) {
      return [];
    } else {
      return memos;
    }
  }

  async #selectMemo(memos, action) {
    const prompt = new enquirer.Select({
      name: "memo",
      message: `Choose a memo you want to ${action}:`,
      footer() {
        const lines = memos[this.index].lines.join("\n");
        return `\n${lines}`;
      },
      choices: memos.map((memo) => memo.lines[0]),
    });

    await prompt.run();
    return memos[prompt.index];
  }

  async #writeMemoToFile(memos, fileLocation) {
    const jsonMemo = JSON.stringify(memos, null, 2);
    await fs.writeFile(fileLocation, jsonMemo, "utf8");
  }

  async #readLines() {
    const rl = createInterface({ input: process.stdin });
    const lines = [];

    rl.on("line", (line) => {
      lines.push(line);
    });

    await once(rl, "close");
    return lines;
  }
}
