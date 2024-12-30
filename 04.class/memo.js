#!/usr/bin/env node

import * as readline from "readline";
import pkg from "enquirer";
import { FileOperation } from "./file_operation.js";

class Memo extends FileOperation {
  constructor() {
    super();
    this.argv = process.argv[2];
    this.file = "memos.json";
    this.displayMemos();
  }

  async add() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const lines = [];

    rl.on("line", (line) => {
      lines.push(line);
    });

    rl.on("close", async () => {
      if (lines.length === 0) {
        return false;
      }
      const memos = (await this.access(this.file))
        ? await this.read(this.file)
        : [];
      memos.push({ lines: lines });
      const jsonMemos = JSON.stringify(memos, null, "\t");
      this.write(this.file, jsonMemos);
    });
  }

  async list() {
    if (this.access(this.file)) {
      const memos = await this.read(this.file);
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
    const { Select } = pkg;

    const memos = await this.read(this.file);

    const prompt = new Select({
      name: "memo",
      message: "Choose a memo you want to see:",
      footer() {
        const index = this.index;
        const lines = String(memos[index].lines).replace(/,/g, "\n");
        return `\n${lines}`;
      },

      choices: memos.map((memo) => memo.lines[0]),
    });
    prompt.run().catch(console.error);
  }

  async delete() {
    const { Select } = pkg;

    const memos = await this.read(this.file);

    const prompt = new Select({
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
        this.write(this.file, jsonMemos);
      })
      .catch(console.error);
  }

  displayMemos() {
    if (this.argv === "-l") {
      this.list();
    } else if (this.argv === "-r") {
      this.reference();
    } else if (this.argv === "-d") {
      this.delete();
    } else {
      this.add();
    }
  }
}

new Memo();
