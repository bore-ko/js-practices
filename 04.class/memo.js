#!/usr/bin/env node

import readline from "readline";
import enquirer from "enquirer";
import { MemoManager } from "./memo_manager.js";

class MemoApp {
  #argv;
  #file_location;
  #memoManager;

  constructor() {
    this.#argv = process.argv[2];
    this.#file_location = "memos.json";
    this.#memoManager = new MemoManager();
  }

  async #list() {
    try {
      const isAccess = await this.#memoManager.isAccess(this.#file_location);
      if (!isAccess) {
        console.log("There are no memo.");
        return;
      }

      const file_location = await this.#memoManager.read(this.#file_location);
      const memos = JSON.parse(file_location);
      if (memos.length === 0) {
        console.log("There are no memo.");
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
      const isAccess = await this.#memoManager.isAccess(this.#file_location);
      if (!isAccess) {
        console.log("There are no memo.");
        return;
      }

      const file_location = await this.#memoManager.read(this.#file_location);
      const memos = JSON.parse(file_location);
      if (memos.length === 0) {
        console.log("There are no memo.");
        return;
      }

      const prompt = new enquirer.Select({
        name: "memo",
        message: "Choose a memo you want to see:",
        footer() {
          const index = this.index;
          const lines = memos[index].lines
            .filter((line) => line !== "")
            .join("\n");
          return `\n${lines}`;
        },

        choices: memos.map((memo) => memo.lines[0]),
      });
      await prompt.run();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async #delete() {
    try {
      const isAccess = await this.#memoManager.isAccess(this.#file_location);
      if (!isAccess) {
        console.log("There are no memo.");
        return;
      }

      const file_location = await this.#memoManager.read(this.#file_location);
      const memos = JSON.parse(file_location);
      if (memos.length === 0) {
        console.log("There are no memo.");
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
      await this.#memoManager.write(this.#file_location, jsonMemos);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async #add() {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    try {
      const inputLines = await this.#memoManager.readLines(rl);
      rl.close();

      const isAccess = await this.#memoManager.isAccess(this.#file_location);
      let memos = [];
      if (isAccess) {
        const file_location = await this.#memoManager.read(this.#file_location);
        memos = JSON.parse(file_location);
      }

      memos.push({ lines: inputLines });
      const jsonMemos = JSON.stringify(memos, null, "  ");
      await this.#memoManager.write(this.#file_location, jsonMemos);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  displayMemos() {
    if (this.#argv === "-l") {
      this.#list();
    } else if (this.#argv === "-r") {
      this.#reference();
    } else if (this.#argv === "-d") {
      this.#delete();
    } else {
      this.#add();
    }
  }
}

const memo = new MemoApp();
memo.displayMemos();
