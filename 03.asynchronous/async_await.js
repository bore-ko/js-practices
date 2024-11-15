#!/usr/bin/env node

import sqlite3 from "sqlite3";
import { run, all, close } from "./sqlite_promise.js";

// async/await エラーなし
let db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const row = await run(
  db,
  "INSERT INTO books (title) VALUES (?)",
  "async/await 学習",
);
console.log(`id: ${row.lastID}`);
const rows = await all(db, "SELECT * FROM books");
rows.forEach((row) => {
  console.log(`id: ${row.id}, title: ${row.title}`);
});
await run(db, "DROP TABLE books");
await close(db);

// async/await エラーあり
db = new sqlite3.Database(":memory:");

await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  await run(db, "INSERT INTO notes (title) VALUES (?)", "async/await 学習");
} catch (err) {
  if (err instanceof Error && err.code == "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    console.error(err);
  }
}
try {
  await all(db, "SELECT * FROM memos");
} catch (err) {
  if (err instanceof Error && err.code == "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    console.error(err);
  }
  await run(db, "DROP TABLE books");
} finally {
  close(db);
}
