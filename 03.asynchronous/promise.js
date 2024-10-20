#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

export const run = (sql, param = null) =>
  new Promise((resolve, reject) => {
    db.run(sql, param, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

export const get = (sql) =>
  new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
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

export const closeDb = () =>
  new Promise((reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
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
    .then(() => get("SELECT id FROM books"))
    .then((row) => console.log(`id: ${row.id}`))
    .then(() => all("SELECT * FROM books"))
    .then((rows) => {
      rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
    })
    .then(() => run("DROP TABLE books", []))
    .finally(() => closeDb());
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
    .finally(() => closeDb());
};

if (process.argv[1].endsWith("promise.js")) {
  handlNonErr();
}

await timers.setTimeout(100);

if (process.argv[1].endsWith("promise.js")) {
  handlErr();
}
