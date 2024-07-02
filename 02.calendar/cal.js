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
  const YearAndMonth = calcYearAndMonth();
  const year = YearAndMonth.year;
  const month = YearAndMonth.month;
  const firstDate = DateTime.fromObject({ year, month });
  const lastDate = firstDate.endOf("month");
  let formattedDays = "";

  console.log(`${month}月 ${year}`.padStart(13, " "));
  console.log("日", "月", "火", "水", "木", "金", "土");

  const spacesToFitStartDay = " ".repeat(firstDate.weekday * 3);
  formattedDays += spacesToFitStartDay;

  for (let day = 1; day <= lastDate.day; day++) {
    const currentDate = DateTime.fromObject({ year, month, day });
    let spacesBeforeAndAfterDay = day.toString().padStart(2, " ");

    if (currentDate.weekday === 6) {
      formattedDays += `${spacesBeforeAndAfterDay}\n`;
    } else if (day !== lastDate.day) {
      formattedDays += (spacesBeforeAndAfterDay += " ");
    } else {
      formattedDays += spacesBeforeAndAfterDay;
    }
  }

  console.log(formattedDays);
}

displayCalendar();