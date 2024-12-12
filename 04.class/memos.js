#!/usr/bin/env node
import * as readline from "readline";
import * as fs from "node:fs/promises";

const argv = process.argv[2];

if (argv === "-l") {
  // 一覧
  listMemo();
} else if (argv === "-r") {
  // 参照
  referenceMemo();
} else if (argv === "-d") {
  // 削除
  deleteMemo();
} else {
  // 追加
  addMemo();
}

async function accessFile(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readFile(file) {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function writeFile(file, data) {
  try {
    await fs.writeFile(file, data, "utf8");
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function addMemo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let lines = [];
  const file = "memos.json";

  rl.on("line", (input) => {
    lines.push(input);
  });

  rl.on("close", async () => {
    let memos = (await accessFile(file)) ? await readFile(file) : [];
    memos.push({ body: lines });

    let jsonMemos = JSON.stringify(memos, null, "\t");
    writeFile(file, jsonMemos);
  });
}

async function listMemo() {
  const file = "memos.json";

  if (accessFile(file)) {
    let memos = await readFile(file);
    let firstMemos = memos.map((memo) => memo.body[0]);
    let listMemos = firstMemos.join("\n");
    console.log(listMemos);
  } else
    (err) => {
      console.log(err);
      throw err;
    };
}

import pkg from "enquirer";

async function referenceMemo() {
  const { Select } = pkg;

  const file = "memos.json";
  let memos = await readFile(file);

  const prompt = new Select({
    name: "memo",
    message: "Choose a note you want to see:",
    footer() {
      let index = this.index;
      return memos[index].body;
    },

    choices: memos.map((memo) => memo.body[0]),
  });
  prompt.run().catch(console.error);
}

async function deleteMemo() {
  const { Select } = pkg;

  const file = "memos.json";
  let memos = await readFile(file);

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
      writeFile(file, jsonMemos);
    })
    .catch(console.error);
}
