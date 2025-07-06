import fs from "node:fs/promises";
import { MemoPrompt } from "./memo_prompt.js";
import { StandardInput } from "./standard_input.js";

export default class MemoApp {
  #option;
  #fileLocation;
  #memoPrompt;
  #standardInput;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#memoPrompt = new MemoPrompt();
    this.#standardInput = new StandardInput();
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
    }
  }

  async #createMemoObjct(fileLocation) {
    const json = await fs.readFile(fileLocation, "utf8");
    const memos = JSON.parse(json);
    if (memos.length === 0) {
      console.log("There are no memos.");
      return;
    } else {
      return memos;
    }
  }

  async #list() {
    this.#checkExistenceMemo(this.#fileLocation);

    try {
      const memos = await this.#createMemoObjct(this.#fileLocation);
      memos.forEach((memo) => {
        console.log(memo.lines[0]);
      });
    } catch {
      return;
    }
  }

  async #refer() {
    this.#checkExistenceMemo(this.#fileLocation);

    let prompt;
    try {
      const memos = await this.#createMemoObjct(this.#fileLocation);
      prompt = this.#memoPrompt.refer(memos);
    } catch {
      return;
    }

    try {
      const referencedMemo = await prompt.run();
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
    this.#checkExistenceMemo(this.#fileLocation);

    let memos;
    let prompt;
    try {
      memos = await this.#createMemoObjct(this.#fileLocation);
      prompt = this.#memoPrompt.delete(memos);
    } catch {
      return;
    }

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

    const jsonMemo = JSON.stringify(memos, null, 2);
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
    const lines = await this.#standardInput.readLines();
    memos.push({ lines: lines });

    const jsonMemo = JSON.stringify(memos, null, 2);
    await fs.writeFile(this.#fileLocation, jsonMemo, "utf8");
  }
}
