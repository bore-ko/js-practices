#!/usr/bin/env node

import readline from "readline";
import enquirer from "enquirer";
import { FileOperation } from "./file_operation.js";

class MemoApp {
  #argv;
  #file_location;
  #fileOperation;

  constructor() {
    this.#argv = process.argv[2];
    this.#file_location = "memos.json";
    this.#fileOperation = new FileOperation();
  }

  #readLines(rl) {
    return new Promise((resolve, reject) => {
      const lines = [];

      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        if (lines.length === 0) {
          resolve(false);
        } else {
          resolve(lines);
        }
      });

      rl.on("error", (err) => {
        reject(err);
      });
    });
  }

  async #list() {
    try {
      if (await this.#fileOperation.isAccess(this.#file_location)) {
        const file_location = await this.#fileOperation.read(
          this.#file_location,
        );
        const memos = JSON.parse(file_location);
        const firstLines = memos.map((memo) => memo.lines[0]);
        console.log(firstLines.join("\n"));
      } else {
        (err) => {
          console.err(err);
          throw err;
        };
      }
    } catch (err) {
      console.error(err);
    }
  }

  async #reference() {
    const file_location = await this.#fileOperation.read(this.#file_location);
    const memos = JSON.parse(file_location);
    if (memos.length === 0) {
      return;
    }
    const prompt = new enquirer.Select({
      name: "memo",
      message: "Choose a memo you want to see:",
      footer() {
        const index = this.index;
        const lines = String(memos[index].lines).replace(/,/g, "\n");
        return `\n${lines}`;
      },

      choices: memos.map((memo) => memo.lines[0]),
    });
    try {
      await prompt.run();
    } catch (err) {
      console.error(err);
    }
  }

  async #delete() {
    const file_location = await this.#fileOperation.read(this.#file_location);
    const memos = JSON.parse(file_location);
    if (memos.length === 0) {
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
    prompt
      .run()
      .then((result) => {
        const index = result - 1;
        memos.splice(index, 1);

        const jsonMemos = JSON.stringify(memos, null, "\t");
        this.#fileOperation.write(this.#file_location, jsonMemos);
      })
      .catch(console.error);
  }

  async #add() {
    const rl = readline.createInterface({
      input: process.stdin,
    });

    try {
      const inputLines = await this.#readLines(rl);
      rl.close();

      const lines = await this.#fileOperation.isAccess(this.#file_location);
      let memos = [];
      if (lines) {
        const file_content = await this.#fileOperation.read(
          this.#file_location,
        );
        memos = JSON.parse(file_content);
      }

      memos.push({ lines: inputLines });
      const jsonMemos = JSON.stringify(memos, null, "  ");
      await this.#fileOperation.write(this.#file_location, jsonMemos);
    } catch (err) {
      console.error(err);
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
