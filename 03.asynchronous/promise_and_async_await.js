#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const run = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

const get = (sql) =>
  new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

const all = (sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

// Promise エラーなし
let db = new sqlite3.Database(":memory:");

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run("INSERT INTO books (title) VALUES ('JS学習')");
  })
  .then(() => {
    return get("SELECT id FROM books").then((row) => {
      console.log(`id: ${row.id}`);
    });
  })
  .then(() =>
    all("SELECT * FROM books").then((rows) => {
      rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
    }),
  )
  .finally(() => {
    db.close();
  });

await timers.setTimeout(100);

// // Promise エラーあり
db = new sqlite3.Database(":memory:");

run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    return run("INSERT INTO notes (title) VALUES ('JS学習')");
  })
  .catch((err) => {
    console.error(err.message);
  })
  .then(() => {
    return all("SELECT * FROM memos");
  })
  .catch((err) => {
    console.error(`${err.message}\n`);
  })
  .finally(() => {
    db.close();
  });

await timers.setTimeout(100);

// async / await エラーなし
db = new sqlite3.Database(":memory:");

async function nonErr() {
  await run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  await run("INSERT INTO books (title) VALUES ('JS学習')");
  const row = await get("SELECT id FROM books");
  console.log(`id: ${row.id}`);
  const rows = await all("SELECT * FROM books");
  rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
  db.close();
}

nonErr();

await timers.setTimeout(100);

// // async / await エラーあり
db = new sqlite3.Database(":memory:");

async function err() {
  try {
    await run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    await run("INSERT INTO notes (title) VALUES ('JS学習')");
  } catch (err) {
    console.error(err.message);
  }
  try {
    await all("SELECT * FROM memos");
  } catch (err) {
    console.error(err.message);
  }
  db.close();
}

err();
