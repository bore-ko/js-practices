#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

// コールバック エラーなし
var db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title) VALUES (?)", "JS学習", () => {
      db.get("SELECT id FROM books", (err, row) => {
        console.log(`id: ${row.id}`);

        db.all("SELECT * FROM books", (err, rows) => {
          rows.forEach((row) =>
            console.log(`id: ${row.id}, title: ${row.title}`),
          );
        });
      });
    });
  },
);

db.close();

await timers.setTimeout(100);

// コールバック エラーあり
db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO notes (title) VALUES (?)", "JS学習", (err) => {
      if (err) {
        console.log(err.message);
      }

      db.all("SELECT * FROM memos", (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    });
  },
);

db.close();
