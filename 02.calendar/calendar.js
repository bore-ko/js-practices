import minimist from "minimist";

function calcFirstDate() {
  const argv = minimist(process.argv.slice(2));
  const date = new Date();

  if (argv["y"] >= 1970 && argv["y"] <= 2100) {
    date.setFullYear(argv.y);
  }

  if (argv["m"] >= 1 && argv["m"] <= 12) {
    date.setMonth(argv.m - 1);
  }

  date.setDate(1);
  return date;
}

export function flipCalendar() {
  const firstDate = calcFirstDate();
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1;
  const lastDate = new Date(year, month, 0);
  let formattedDays = "";

  console.log(`${month}月 ${year}`.padStart(13, " "));
  console.log("日", "月", "火", "水", "木", "金", "土");

  let add_spaces_to_fit_start_day = " ".repeat(firstDate.getDay() * 3, " ");
  formattedDays += add_spaces_to_fit_start_day;

  for (let day = 1; day <= lastDate.getDate(); day++) {
    const currentDate = new Date();
    currentDate.setFullYear(year, month - 1, day);

    let add_spaces_before_and_after_day = day.toString().padStart(2, " ");
    if (currentDate.getDay() !== 6 && day !== lastDate.getDate()) {
      add_spaces_before_and_after_day += " ";
    }

    formattedDays +=
      currentDate.getDay() === 6
        ? `${add_spaces_before_and_after_day}\n`
        : add_spaces_before_and_after_day;
  }
  formattedDays += "\n";

  process.stdout.write(formattedDays);
}
