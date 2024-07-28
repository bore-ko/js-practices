#!/usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";
luxon.Settings.defaultLocale = "ja";

function calcYearAndMonth() {
  const argv = minimist(process.argv.slice(2));
  const date = new Date();

  if (1970 <= argv.y && argv.y <= 2100) {
    date.setFullYear(argv.y);
  }

  if (1 <= argv.m && argv.m <= 12) {
    date.setMonth(argv.m - 1);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return { year, month };
}

function displayCalendar() {
  const { year, month } = calcYearAndMonth();

  console.log(`${month.toString().padStart(7, " ")}月 ${year}`);
  console.log("日 月 火 水 木 金 土");

  const firstDate = luxon.DateTime.fromObject({ year, month });
  let formattedDays = "";

  if (firstDate.weekdayShort !== "日") {
    const startDaySpaces = " ".repeat(firstDate.weekday * 3);
    formattedDays += startDaySpaces;
  }

  let currentDate = luxon.DateTime.fromObject({ year, month });
  const lastDate = firstDate.endOf("month");

  for (
    currentDate;
    currentDate < lastDate;
    currentDate = currentDate.plus({ days: 1 })
  ) {
    let formattedDay = currentDate.day.toString().padStart(2, " ");

    if (currentDate.day !== lastDate.day && currentDate.weekdayShort === "土") {
      formattedDay = `${formattedDay}\n`;
    } else if (currentDate.day !== lastDate.day) {
      formattedDay = `${formattedDay} `;
    }

    formattedDays += formattedDay;
  }

  const MAX_DAYS_LENGTH = 104;

  if (formattedDays.length <= MAX_DAYS_LENGTH) {
    formattedDays += "\n";
  }

  console.log(formattedDays);
}

displayCalendar();
