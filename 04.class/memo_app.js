#!/usr/bin/env node

import fs from "node:fs/promises";
import { MemoPreparation } from "./memo_preparation.js";

class MemoApp {
  #option;
  #fileLocation;
  #MemoPreparation;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#MemoPreparation = new MemoPreparation();
  }

  async #list() {
    try {
      await fs.access(this.#fileLocation);
    } catch {
      console.error("There are no memos.");
      return;
    }

    const readedMemos = await fs.readFile(this.#fileLocation, "utf8");
    if (readedMemos === "[]") {
      console.log("There are no memos.");
      return;
    }

    const memos = await this.#MemoPreparation.parseJson(readedMemos);
    memos.forEach((memo) => {
      console.log(memo.lines[0]);
    });
  }

  async #reference() {
    try {
      await fs.access(this.#fileLocation);
    } catch {
      console.error("There are no memos.");
      return;
    }

    const readedMemos = await fs.readFile(this.#fileLocation, "utf8");
    if (readedMemos === "[]") {
      console.log("There are no memos.");
      return;
    }

    const memos = await this.#MemoPreparation.parseJson(readedMemos);
    const prompt = this.#MemoPreparation.referencePrompt(memos);
    try {
      const response = await prompt.run();
      console.log(response);
    } catch (err) {
      if (err === "") {
        console.error("program termination.");
      } else {
        throw err;
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

    const readedMemos = await fs.readFile(this.#fileLocation, "utf8");
    if (readedMemos === "[]") {
      console.log("There are no memos.");
      return;
    }

    const memos = await this.#MemoPreparation.parseJson(readedMemos);
    const prompt = this.#MemoPreparation.deletePrompt(memos);
    try {
      const deleteMemo = await prompt.run();
      const index = deleteMemo - 1;
      memos.splice(index, 1);
    } catch (err) {
      if (err === "") {
        console.error("program termination.");
      } else {
        throw err;
      }
    }

    const jsonMemos = JSON.stringify(memos, null, "  ");
    try {
      await fs.writeFile(this.#fileLocation, jsonMemos, "utf8");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async #add() {
    let isMemo;
    try {
      await fs.access(this.#fileLocation);
    } catch {
      isMemo = false;
    }

    let readedMemos;
    if (isMemo !== false) {
      readedMemos = await fs.readFile(this.#fileLocation, "utf8");
    }

    const memos = await this.#MemoPreparation.parseJson(readedMemos);
    try {
      const inputLines = await this.#MemoPreparation.readLines();
      memos.push({ lines: inputLines });
    } catch (err) {
      console.error(err);
      throw err;
    }

    const jsonMemos = JSON.stringify(memos, null, "  ");
    try {
      await fs.writeFile(this.#fileLocation, jsonMemos, "utf8");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  OperateApp() {
    if (this.#option === "-l") {
      this.#list();
    } else if (this.#option === "-r") {
      this.#reference();
    } else if (this.#option === "-d") {
      this.#delete();
    } else {
      this.#add();
    }
  }
}

const memo = new MemoApp();
memo.OperateApp();
