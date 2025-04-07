#!/usr/bin/env node

import fs from "node:fs/promises";
import enquirer from "enquirer";
import { MemoManager } from "./memo_manager.js";

class MemoApp {
  #option;
  #fileLocation;
  #memoManager;

  constructor() {
    this.#option = process.argv[2];
    this.#fileLocation = "memos.json";
    this.#memoManager = new MemoManager();
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

    try {
      const memos = JSON.parse(readedMemos);
      memos.forEach((memo) => {
        console.log(memo.lines[0]);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
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

    try {
      const memos = JSON.parse(readedMemos);
      const prompt = new enquirer.Select({
        name: "memo",
        message: "Choose a memo you want to see:",
        footer() {
          const lines = memos[this.index].lines.join("\n");
          return `\n${lines}`;
        },

        choices: memos.map((memo) => memo.lines[0]),
        result() {
          return memos[this.index].lines.join("\n");
        },
      });
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

    try {
      const memos = JSON.parse(readedMemos);
      const prompt = new enquirer.Select({
        name: "memo",
        message: "Choose a memo you want to delete:",
        choices: memos.map((memo) => memo.lines[0]),
        result() {
          return this.index + 1;
        },
      });
      const deleteMemo = await prompt.run();
      const index = deleteMemo - 1;
      memos.splice(index, 1);

      const jsonMemos = JSON.stringify(memos, null, "  ");
      try {
        await fs.writeFile(this.#fileLocation, jsonMemos, "utf8");
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      if (err === "") {
        console.error("program termination.");
      } else {
        throw err;
      }
    }
  }

  async #add() {
    try {
      const inputLines = await this.#memoManager.readLines();
      let memos = [];
      try {
        await fs.access(this.#fileLocation);
        const readedMemos = await fs.readFile(this.#fileLocation, "utf8");
        memos = JSON.parse(readedMemos);
        memos.push({ lines: inputLines });
      } catch {
        memos.push({ lines: inputLines });
      }
      const jsonMemos = JSON.stringify(memos, null, "  ");
      try {
        await fs.writeFile(this.#fileLocation, jsonMemos, "utf8");
      } catch (err) {
        console.error(err);
      }
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
