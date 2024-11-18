#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import { run, all, close } from "./sqlite_promise.js";

// Promise エラーなし
let db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (?)", "Promise 学習"))
  .then((row) => {
    console.log(`id: ${row.lastID}`);
    return all(db, "SELECT * FROM books");
  })
  .then((rows) => {
    rows.forEach((row) => {
      console.log(`id: ${row.id}, title: ${row.title}`);
    });
    return run(db, "DROP TABLE books");
  })
  .finally(() => {
    return close(db);
  });

await timers.setTimeout(100);

// Promise エラーあり
db = new sqlite3.Database(":memory:");

run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => run(db, "INSERT INTO notes (title) VALUES (?)", "Promise 学習"))
  .catch((err) => {
    if (err instanceof Error && err.code == "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return all(db, "SELECT * FROM memos");
  })
  .catch((err) => {
    if (err instanceof Error && err.code == "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      console.error(err);
    }
    return run(db, "DROP TABLE books");
  })
  .finally(() => {
    return close(db);
  });
