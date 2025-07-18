import fs from "node:fs/promises";
import { MemoPrompt } from "./memo_prompt.js";
import { createInterface } from "readline/promises";
import { once } from "events";

export default class MemoApp {
  #option;
  #fileLocation;
  #memoPrompt;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#memoPrompt = new MemoPrompt();
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

  async #checkExistenceMemo(fileLocation) {
    try {
      await fs.access(fileLocation);
    } catch {
      console.error("There are no memos.");
      throw new Error();
    }
  }

  async #createMemoObjct(fileLocation) {
    const json = await fs.readFile(fileLocation, "utf8");
    const memos = JSON.parse(json);
    if (memos.length === 0) {
      console.error("There are no memos.");
      throw new Error();
    } else {
      return memos;
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

  async #list() {
    try {
      await this.#checkExistenceMemo(this.#fileLocation);
    } catch {
      return;
    }

    let memos;
    try {
      memos = await this.#createMemoObjct(this.#fileLocation);
    } catch {
      return;
    }

    memos.forEach((memo) => {
      console.log(memo.lines[0]);
    });
  }

  async #refer() {
    try {
      await this.#checkExistenceMemo(this.#fileLocation);
    } catch {
      return;
    }

    let memos;
    try {
      memos = await this.#createMemoObjct(this.#fileLocation);
    } catch {
      return;
    }

    try {
      const referencedMemo = await this.#memoPrompt.selectMemo(memos, "see");
      console.log(referencedMemo.lines.join("\n"));
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
    } catch {
      return;
    }

    let memos;
    try {
      memos = await this.#createMemoObjct(this.#fileLocation);
    } catch {
      return;
    }

    const deletionMemo = await this.#memoPrompt.selectMemo(memos, "delete");
    const filteredMemos = memos.filter(function (memo) {
      return memo !== deletionMemo;
    });

    const jsonMemo = JSON.stringify(filteredMemos, null, 2);
    await fs.writeFile(this.#fileLocation, jsonMemo, "utf8");
  }

  async #add() {
    let json;
    try {
      await fs.access(this.#fileLocation);
      json = await fs.readFile(this.#fileLocation, "utf8");
    } catch {
      json = JSON.stringify([], null, 2);
    }

    let memos = JSON.parse(json);
    const lines = await this.#readLines();
    memos.push({ lines: lines });

    const jsonMemo = JSON.stringify(memos, null, 2);
    await fs.writeFile(this.#fileLocation, jsonMemo, "utf8");
  }
}
