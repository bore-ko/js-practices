#!/usr/bin/env node

import { run, all, close } from "./sqlite_promise.js";

// async/await エラーなし
await run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
const row = await run(
  "INSERT INTO books (title) VALUES (?)",
  "async/await 学習",
);
console.log(`id: ${row.lastID}`);
const rows = await all("SELECT * FROM books");
rows.forEach((row) => {
  console.log(`id: ${row.id}, title: ${row.title}`);
});
await run("DROP TABLE books");

// async/await エラーあり
await run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
try {
  await run("INSERT INTO notes (title) VALUES (?)", "async/await 学習");
} catch (err) {
  if (err instanceof Error && err.code == "SQLITE_ERROR") {
    console.error(err.message);
  }
}
try {
  await all("SELECT * FROM memos");
} catch (err) {
  if (err instanceof Error && err.code == "SQLITE_ERROR") {
    console.error(err.message);
  }
  await run("DROP TABLE books");
} finally {
  close();
}
