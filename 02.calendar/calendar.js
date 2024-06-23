import minimist from "minimist";

function calcFirstDate() {
  const argv = minimist(process.argv.slice(2));
  const date = new Date();

  if (Object.hasOwn(argv, "y")) {
    date.setFullYear(argv.y);
  }

  if (Object.hasOwn(argv, "m")) {
    date.setMonth(argv.m - 1);
  }

  date.setUTCDate(1);
  return date;
}

export function flipCalendar() {
  const firstDate = calcFirstDate();
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1;
  const lastDate = new Date(Date.UTC(year, month, 0));
  let formattedDays = "";

  console.log(`${month}月 ${year}`.padStart(13, " "));
  console.log("日", "月", "火", "水", "木", "金", "土");

  for (let day = 1; day <= lastDate.getDate(); day++) {
    const currentDate = new Date();
    currentDate.setFullYear(year, month - 1, day);

    if (day === 1) {
      const add_spaces_to_fit_start_day = "".padStart(
        currentDate.getDay() * 3,
        " ",
      );
      formattedDays += add_spaces_to_fit_start_day;
    }

    const add_spaces_before_and_after_day =
      day.toString().padStart(2, " ") + " ";

    formattedDays +=
      currentDate.getDay() === 6
        ? `${add_spaces_before_and_after_day}\n`
        : add_spaces_before_and_after_day;
  }

  process.stdout.write(formattedDays);
}
