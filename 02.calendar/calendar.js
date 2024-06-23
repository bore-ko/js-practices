import minimist from "minimist";

function calc_month() {
  const argv = minimist(process.argv.slice(2));
  const argv_year = argv.y;
  const argv_month = argv.m;

  const date = new Date();

  if (Object.hasOwn(argv, "y")) {
    date.setFullYear(argv_year);
  }

  if (Object.hasOwn(argv, "m")) {
    date.setMonth(argv_month - 1);
  }

  date.setUTCDate(1);
  return date;
}

export function flip_calendar() {
  const first_date = calc_month();
  const year = first_date.getFullYear();
  const month = first_date.getMonth() + 1;
  const last_date = new Date(Date.UTC(year, month, 0));
  let formatted_days = "";

  console.log(new String(month + "月" + " " + year).padStart(13, " "));
  console.log("日", "月", "火", "水", "木", "金", "土");

  for (let day = 1; day <= last_date.getDate(); day++) {
    const current_date = new Date();
    current_date.setFullYear(year, month - 1, day);

    if (day === 1) {
      const add_spaces_to_fit_start_day = "".padStart(
        current_date.getDay() * 3,
        " ",
      );
      formatted_days += add_spaces_to_fit_start_day;
    }

    const add_spaces_before_and_after_day =
      day.toString().padStart(2, " ") + " ";

    formatted_days +=
      current_date.getDay() === 6
        ? add_spaces_before_and_after_day.concat("\n")
        : add_spaces_before_and_after_day;
  }

  process.stdout.write(formatted_days);
}
