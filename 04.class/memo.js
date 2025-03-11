#!/usr/bin/env node

import readline from "readline";
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
      const isMemosExists = await this.#memoManager.isAccessible(this.#fileLocation);
      if (!isMemosExists) {
        console.log("There are no memos.");
        return;
      }

      const readedMemos= await this.#memoManager.read(this.#fileLocation);
      const memos = JSON.parse(readedMemos);
      if (memos.length === 0) {
        console.log("There are no memos.");
        return;
      }

      const firstLines = memos.map((memo) => memo.lines[0]);
      console.log(firstLines.join("\n"));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async #reference() {
    try {
      const isMemosExists = await this.#memoManager.isAccessible(this.#fileLocation);
      if (!isMemosExists) {
        console.log("There are no memos.");
        return;
      }

      const readedMemos = await this.#memoManager.read(this.#fileLocation);
      const memos = JSON.parse(readedMemos);
      if (memos.length === 0) {
        console.log("There are no memos.");
        return;
      }

      const prompt = new enquirer.Select({
        name: "memo",
        message: "Choose a memo you want to see:",
        footer() {
          const lines = memos[this.index].lines
            .filter((line) => line !== "")
            .join("\n");
          return `\n${lines}`;
        },

        choices: memos.map((memo) => memo.lines[0]),
      });
      await prompt.run();
      console.log(memos[prompt.index].lines.join("\n"));
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
      const isMemosExists = await this.#memoManager.isAccessible(this.#fileLocation);
      if (!isMemosExists) {
        console.log("There are no memos.");
        return;
      }

      const readedMemos = await this.#memoManager.read(this.#fileLocation);
      const memos = JSON.parse(readedMemos);
      if (memos.length === 0) {
        console.log("There are no memos.");
        return;
      }

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
      await this.#memoManager.write(this.#fileLocation, jsonMemos);
    } catch (err) {
      if (err === "") {
        console.error("program termination.");
      } else {
        throw err;
      }
    }
  }

  async #add() {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    try {
      const inputLines = await this.#memoManager.readLines(rl);
      rl.close();

      const isMemosExists = await this.#memoManager.isAccessible(
        this.#fileLocation,
      );
      let memos = [];
      if (isMemosExists) {
        const readedMemos = await this.#memoManager.read(this.#fileLocation);
        memos = JSON.parse(readedMemos);
      }

      memos.push({ lines: inputLines });
      const jsonMemos = JSON.stringify(memos, null, "  ");
      await this.#memoManager.write(this.#fileLocation, jsonMemos);
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
