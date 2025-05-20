#!/usr/bin/env node

import fs from "node:fs/promises";
import { MemoPreparation } from "./memo_preparation.js";

class Memo {
  #option;
  #fileLocation;
  #memoPreparation;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#memoPreparation = new MemoPreparation();
  }

  operateApp() {
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

  async #reference() {
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

    const prompt = this.#memoPreparation.referencePrompt(memos);
    try {
      const response = await prompt.run();
      console.log(response);
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

    const prompt = this.#memoPreparation.deletePrompt(memos);
    try {
      const deleteMemo = await prompt.run();
      const index = deleteMemo - 1;
      memos.splice(index, 1);
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
    let isMemo;
    try {
      await fs.access(this.#fileLocation);
    } catch {
      isMemo = false;
    }

    let jsonList;
    if (isMemo !== false) {
      jsonList = await fs.readFile(this.#fileLocation, "utf8");
    }

    const memos = JSON.parse(jsonList);
    try {
      const inputLines = await this.#memoPreparation.readLines();
      memos.push({ lines: inputLines });
    } catch (error) {
      console.error(error);
      throw error;
    }

    jsonList = JSON.stringify(memos, null, 2);
    try {
      await fs.writeFile(this.#fileLocation, jsonList, "utf8");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const memo = new Memo();
memo.operateApp();
