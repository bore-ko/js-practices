#!/usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";

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

function displayCalendar(calcYearAndMonth) {
  const { year, month } = calcYearAndMonth;

  console.log(
    `      ${month.toString().padStart(month.length, " ")}月 ${year}`,
  );
  console.log("日 月 火 水 木 金 土");

  const firstDate = luxon.DateTime.fromObject({ year, month });
  const lastDate = firstDate.endOf("month").startOf("day");
  let formattedDays = "";

  if (firstDate.weekday !== 7) {
    const startDaySpaces = " ".repeat(firstDate.weekday * 3);
    formattedDays += startDaySpaces;
  }

  for (
    let currentDate = luxon.DateTime.fromObject({ year, month });
    currentDate <= lastDate;
    currentDate = currentDate.plus({ days: 1 })
  ) {
    let formattedDay = currentDate.day.toString().padStart(2, " ");

    if (currentDate.day !== lastDate.day) {
      formattedDay += currentDate.weekday === 6 ? `\n` : ` `;
    }
    formattedDays += formattedDay;
  }

  const weekCharlength = 20;
  const newLineLength = 1;
  const fiveWeeksLineLength = weekCharlength * 5 + newLineLength * 4;

  if (formattedDays.length <= fiveWeeksLineLength) {
    formattedDays += "\n";
  }

  console.log(formattedDays);
}

displayCalendar(calcYearAndMonth());
