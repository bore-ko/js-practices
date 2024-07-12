#!/usr/bin/env node

import minimist from "minimist";
import { DateTime } from "luxon";

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

  console.log(`${month}月 ${year}`.padStart(13, " "));
  console.log("日", "月", "火", "水", "木", "金", "土");

  const firstDate = DateTime.fromObject({ year, month });
  let formattedDays = "";

  if (firstDate.weekdayShort !== "日") {
    const startDaySpaces = " ".repeat(firstDate.weekday * 3);
    formattedDays += startDaySpaces;
  }

  const lastDate = firstDate.endOf("month");

  for (let day = 1; day <= lastDate.day; day++) {
    const currentDate = DateTime.fromObject({ year, month, day });
    let daySpaces = day.toString().padStart(2, " ");

    if (day === lastDate.day) {
      formattedDays += daySpaces;
    } else if (currentDate.weekdayShort === "土") {
      formattedDays += `${daySpaces}\n`;
    } else {
      formattedDays += daySpaces += " ";
    }
  }

  if (formattedDays.length <= 104) formattedDays += "\n";

  console.log(formattedDays);
}

displayCalendar();
