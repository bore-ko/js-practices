#!/usr/bin/env node

import timers from "timers/promises";
import { run, all, close } from "./sqlite_promise.js";

// Promise エラーなし
run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run("INSERT INTO books (title) VALUES (?)", "Promise 学習"))
  .then((row) => {
    console.log(`id: ${row.lastID}`);
    return all("SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(`id: ${row.id}, title: ${row.title}`);
      return run("DROP TABLE books");
    });
  });

await timers.setTimeout(100);

// Promise エラーあり
run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run("INSERT INTO notes (title) VALUES (?)", "Promise 学習"))
  .catch((err) => {
    if (err instanceof Error && err.code == "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return all("SELECT * FROM memos");
  })
  .catch((err) => {
    if (err instanceof Error && err.code == "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return run("DROP TABLE books");
  })
  .finally(() => close());
