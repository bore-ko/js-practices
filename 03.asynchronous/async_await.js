#!/usr/bin/env node

import timers from "timers/promises";
import { initDb, run, get, all, dbClose } from "./promise.js";

nonErr();

await timers.setTimeout(100);

err();

// async / await エラーなし
async function nonErr() {
  initDb();
  await run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  await run("INSERT INTO books (title) VALUES ('async/await 学習')");
  const row = await get("SELECT id FROM books");
  console.log(`id: ${row.id}`);
  const rows = await all("SELECT * FROM books");
  rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
  dbClose();
}

// async / await エラーあり
async function err() {
  initDb();
  try {
    await run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await run("INSERT INTO notes (title) VALUES ('async/await 学習')");
  } catch (err) {
    console.error(err.message);
  }
  try {
    await all("SELECT * FROM memos");
  } catch (err) {
    console.error(err.message);
  }
  dbClose();
}
