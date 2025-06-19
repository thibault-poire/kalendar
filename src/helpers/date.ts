import { DAY } from "~/types/date.enum";

import type { MONTH } from "~/types/date.enum";
import type { LOCALE } from "~/types/locale.enum";

function get_dates_after(number: number, date: Date) {
  return Array.from(
    { length: number },
    (_, index) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + index + 1),
  );
}

function get_dates_before(number: number, date: Date) {
  return Array.from({ length: number }, (_, index) => new Date(date.getFullYear(), date.getMonth(), -index));
}

export function get_month_as_chunks(year: number, month: MONTH) {
  const first_date_of_month = new Date(year, month);
  const last_date_of_month = new Date(year, month + 1, 0);
  const number_of_days = last_date_of_month.getDate();
  const number_of_previous_month_date = (first_date_of_month.getDay() + 6) % 7;
  const number_of_next_month_date = 42 - (number_of_days + number_of_previous_month_date);
  const chunks: Date[][] = [];

  const dates = [
    ...get_dates_before(number_of_previous_month_date, first_date_of_month),
    ...Array.from({ length: number_of_days }, (_, index) => new Date(year, month, index + 1)),
    ...get_dates_after(number_of_next_month_date, last_date_of_month),
  ];

  dates.forEach((_, index) => {
    if (index % 7 === 0) {
      chunks.push(dates.map((date) => date).slice(index, index + 7));
    }
  });

  return chunks;
}

export function get_translated_day_names(locale: LOCALE) {
  const start_day = DAY.MONDAY;

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(0, 0, 0 + start_day + index);

    return { long: date.toLocaleDateString(locale, { weekday: 'long' }), short: date.toLocaleDateString(locale, { weekday: 'short' }) };
  });
}

export function get_translated_date(
  date: Date,
  locale: LOCALE,
  format: { with_day?: boolean; with_month?: boolean; with_year?: boolean },
) {
  const { with_day, with_month, with_year } = format;

  return date.toLocaleDateString(locale, {
    day: with_day ? 'numeric' : undefined,
    month: with_month ? 'long' : undefined,
    year: with_year ? 'numeric' : undefined,
  });
}

export function add_month_to_date(date: Date) {
  const current_month = date.getMonth();

  if (current_month === 11) {
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(0);

    return date;
  }

  date.setMonth(current_month + 1);

  return date;
}

export function subtract_month_to_date(date: Date) {
  const current_month = date.getMonth();

  if (current_month === 0) {
    date.setFullYear(date.getFullYear() - 1);
    date.setMonth(11);

    return date;
  }

  date.setMonth(current_month - 1);

  return date;
}