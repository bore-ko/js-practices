#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const run = (tableName) =>
  new Promise((resolve) => {
    db.run(
      "CREATE TABLE " +
        tableName +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
      () => {
        resolve();
      },
    );
  });

const insert = (tableName, titleName) =>
  new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO " + tableName + "(title) VALUES(?)",
      titleName,
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      },
    );
  });

const get = (tableName) =>
  new Promise((resolve, reject) => {
    db.get("SELECT id FROM " + tableName, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });

const all = (tableName) =>
  new Promise((resolve, reject) => {
    db.all("SELECT * FROM " + tableName, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

const tableBooks = "books";
const titleName = "JS学習";
const tableNotes = "notes";
const tableMemos = "memos";

// Promise エラーなし
var db = new sqlite3.Database(":memory:");

run(tableBooks)
  .then(() => {
    return insert(tableBooks, titleName);
  })
  .then(() => {
    return get(tableBooks).then((row) => {
      console.log(`id: ${row.id}`);
    });
  })
  .then(() =>
    all(tableBooks).then((rows) => {
      rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
    }),
  )
  .finally(() => {
    db.close();
  });

await timers.setTimeout(100);

// Promise エラーあり
db = new sqlite3.Database(":memory:");

run(tableBooks)
  .then(() => {
    return insert(tableNotes, titleName);
  })
  .catch((err) => {
    console.log(err.message);
  })
  .then(() => {
    return all(tableMemos);
  })
  .catch((err) => {
    console.log(`${err.message}\n`);
  })
  .finally(() => {
    db.close();
  });

await timers.setTimeout(100);

// async / await エラーなし
db = new sqlite3.Database(":memory:");

async function nonErr(tableBooks) {
  await run(tableBooks);
  await insert(tableBooks, titleName);
  const row = await get(tableBooks);
  console.log(`id: ${row.id}`);
  const rows = await all(tableBooks);
  rows.forEach((row) => console.log(`id: ${row.id}, title: ${row.title}`));
  db.close();
}

nonErr(tableBooks);

await timers.setTimeout(100);

// async / await エラーあり
db = new sqlite3.Database(":memory:");

async function err(tableBooks) {
  try {
    await run(tableBooks);
    await insert(tableNotes, titleName);
  } catch (err) {
    console.log(err.message);
  }
  try {
    await all(tableMemos);
  } catch (err) {
    console.log(err.message);
  }
  db.close();
}

err(tableBooks);
