#!/usr/bin/env node

import readline from "readline";
import enquirer from "enquirer";
import { FileOperation } from "./file_operation.js";

class Memo {
  #argv;
  #file_location;
  #fileOperation;

  constructor() {
    this.#argv = process.argv[2];
    this.#file_location = "memos.json";
    this.#fileOperation = new FileOperation();
  }

  #readLines() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const lines = [];

    return new Promise((resolve, reject) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        if (lines.length === 0) {
          reject(false);
        } else {
          resolve(lines);
        }
      });
    });
  }

  async list() {
    if (this.#fileOperation.isAccess(this.#file_location)) {
      const file_location = await this.#fileOperation.read(this.#file_location);
      const memos = JSON.parse(file_location);
      const firstLines = memos.map((memo) => memo.lines[0]);
      console.log(firstLines.join("\n"));
    } else {
      (err) => {
        console.err(err);
        throw err;
      };
    }
  }

  async reference() {
    const file_location = await this.#fileOperation.read(this.#file_location);
    const memos = JSON.parse(file_location);
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

  async delete() {
    const file_location = await this.#fileOperation.read(this.#file_location);
    const memos = JSON.parse(file_location);
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

  async add() {
    try {
      const inputLines = await this.#readLines();
      const file_location = (await this.#fileOperation.isAccess(
        this.#file_location,
      ))
        ? await this.#fileOperation.read(this.#file_location)
        : [];
      const memos = JSON.parse(file_location);
      memos.push({ lines: inputLines });
      const jsonMemos = JSON.stringify(memos, null, "  ");
      await this.#fileOperation.write(this.#file_location, jsonMemos);
    } catch (err) {
      console.error(err);
    }
  }

  displayMemos() {
    if (this.#argv === "-l") {
      this.list();
    } else if (this.#argv === "-r") {
      this.reference();
    } else if (this.#argv === "-d") {
      this.delete();
    } else {
      this.add();
    }
  }
}

const memo = new Memo();
memo.displayMemos();
