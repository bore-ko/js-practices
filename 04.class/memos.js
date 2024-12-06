#!/usr/bin/env node
import * as readline from "readline";
import * as fs from "node:fs/promises";

const argv = process.argv[2];

if (argv === "-l") {
  // 一覧
} else if (argv === "-r") {
  // 参照
} else if (argv === "-d") {
  // 削除
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
