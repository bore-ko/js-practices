import fs from "node:fs/promises";
import { createInterface } from "readline/promises";
import { once } from "events";
import { Prompt } from "./prompt.js";

export class MemoApp {
  #option;
  #fileLocation;
  #prompt;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#prompt = new Prompt();
  }

  operateApp() {
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
      await fs.access(this.#fileLocation);
    } catch {
      console.error("There are no memos.");
      return;
    }

    const jsonList = await fs.readFile(this.#fileLocation, "utf8");
    const memos = JSON.parse(jsonList);
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
      await fs.access(this.#fileLocation);
    } catch {
      console.error("There are no memos.");
      return;
    }

    const jsonList = await fs.readFile(this.#fileLocation, "utf8");
    const memos = JSON.parse(jsonList);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    }

    const prompt = this.#prompt.refer(memos);
    try {
      const referencedMemo = await prompt.run();
      console.log(referencedMemo);
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
      await fs.access(this.#fileLocation);
    } catch {
      console.error("There are no memos.");
      return;
    }

    let jsonList = await fs.readFile(this.#fileLocation, "utf8");
    const memos = JSON.parse(jsonList);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    }

    const prompt = this.#prompt.delete(memos);
    try {
      const deletionIndex = await prompt.run();
      memos.splice(deletionIndex, 1);
    } catch (error) {
      if (error === "") {
        console.error("program termination.");
      } else {
        throw error;
      }
    }

    jsonList = JSON.stringify(memos, null, 2);
    try {
      await fs.writeFile(this.#fileLocation, jsonList, "utf8");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async #add() {
    let jsonList;
    try {
      await fs.access(this.#fileLocation);
      jsonList = await fs.readFile(this.#fileLocation, "utf8");
    } catch {
      jsonList = JSON.stringify([], null, 2);
    }

    let memos = JSON.parse(jsonList);
    const inputLines = await this.#readLines();

    memos.push({ lines: inputLines });

    jsonList = JSON.stringify(memos, null, 2);
    try {
      await fs.writeFile(this.#fileLocation, jsonList, "utf8");
    } catch (error) {
      console.error(error);
      throw error;
    }
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
