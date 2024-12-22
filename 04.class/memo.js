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

    let lines = [];

    rl.on("line", (input) => {
      lines.push(input);
    });

    rl.on("close", async () => {
      if (lines.length === 0) {
        return false;
      }
      let memos = (await this.access(this.file))
        ? await this.read(this.file)
        : [];
      memos.push({ body: lines });
      let jsonMemos = JSON.stringify(memos, null, "\t");
      this.write(this.file, jsonMemos);
    });
  }

  async list() {
    if (this.access(this.file)) {
      let memos = await this.read(this.file);
      let firstMemos = memos.map((memo) => memo.body[0]);
      let listMemos = firstMemos.join("\n");
      console.log(listMemos);
    } else {
      (err) => {
        console.err(err);
        throw err;
      };
    }
  }

  async reference() {
    const { Select } = pkg;

    let memos = await this.read(this.file);

    const prompt = new Select({
      name: "memo",
      message: "Choose a note you want to see:",
      footer() {
        let index = this.index;
        let body = String(memos[index].body).replace(/,/g, "\n");
        return `\n${body}`;
      },

      choices: memos.map((memo) => memo.body[0]),
    });
    prompt.run().catch(console.error);
  }

  async delete() {
    const { Select } = pkg;

    let memos = await this.read(this.file);

    const prompt = new Select({
      name: "memo",
      message: "Choose a memo you want to delete:",
      choices: memos.map((memo) => memo.body[0]),
      result() {
        return this.index + 1;
      },
    });
    prompt
      .run()
      .then((result) => {
        let index = result - 1;
        memos.splice(index, 1);

        let jsonMemos = JSON.stringify(memos, null, "\t");
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
