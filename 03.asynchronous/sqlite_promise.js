#!/usr/bin/env node

import sqlite3 from "sqlite3";

let db = new sqlite3.Database(":memory:");

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
