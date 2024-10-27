#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

export const run = (sql, param) =>
  new Promise((resolve, reject) => {
    db.run(sql, param, function (err, row) {
      if (err) {
        reject(err);
      } else {
        resolve({ row, lastID: this.lastID });
      }
    });
  });

export const all = (sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

export const close = () =>
  new Promise((resolve, reject) => {
    db.close((err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

let db = new sqlite3.Database(":memory:");

// Promise エラーなし
const handlNonErr = () => {
  run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    [],
  )
    .then(() => run("INSERT INTO books (title) VALUES (?)", ["Promise 学習"]))
    .then((row) => {
      console.log(`id: ${row.lastID}`);
    })
    .then(() => all("SELECT * FROM books"))
    .then((rows) => {
      rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
    })
    .then(() => run("DROP TABLE books", []))
    .finally(() => close());
};

// Promise エラーあり
const handlErr = () => {
  db = new sqlite3.Database(":memory:");

  run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    [],
  )
    .then(() => run("INSERT INTO notes (title) VALUES (?)", ["Promise 学習"]))
    .catch((err) => console.error(err.message))
    .then(() => all("SELECT * FROM memos"))
    .catch((err) => console.error(err.message))
    .then(() => run("DROP TABLE books", []))
    .finally(() => close());
};

if (process.argv[1].endsWith("promise.js")) {
  handlNonErr();
}

await timers.setTimeout(100);

if (process.argv[1].endsWith("promise.js")) {
  handlErr();
}
