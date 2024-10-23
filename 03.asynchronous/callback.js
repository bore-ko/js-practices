#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

// コールバック エラーなし
let db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books (title) VALUES (?)",
      "callback 学習",
      function () {
        console.log(`id: ${this.lastID}`);

        db.all("SELECT * FROM books", (_, rows) => {
          rows.forEach((row) =>
            console.log(`id: ${row.id}, title: ${row.title}`),
          );

          db.run("DROP TABLE books", () => {
            db.close();
          });
        });
      },
    );
  },
);

await timers.setTimeout(100);

// コールバック エラーあり
db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO notes (title) VALUES (?)", "callback 学習", (err) => {
      if (err) {
        console.error(err.message);
      }

      db.all("SELECT * FROM memos", (err) => {
        if (err) {
          console.error(err.message);
        }

        db.run("DROP TABLE books", () => {
          db.close();
        });
      });
    });
  },
);
