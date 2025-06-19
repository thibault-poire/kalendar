import { component$ } from '@builder.io/qwik';

import { get_month_as_chunks, get_translated_day_names } from '~/helpers/date';

import { Day } from '~/components/day/day';
import { Table } from '~/components/table/table';

import clsx from 'clsx';
import type { LOCALE } from '~/helpers/date';

type Props = {
  class?: string;
  date: Date;
  locale: LOCALE;
};

export const Month = component$(({ class: _class, date, locale }: Props) => {
  const translated_day_names = get_translated_day_names(locale);
  const dates = get_month_as_chunks(date.getFullYear(), date.getMonth()).map((month) => {
    return month.map((month_date) => {
      return <Day class={clsx(date.getMonth() !== month_date.getMonth() && 'kldr:text-gray-500')} date={month_date} key={date.getTime()} />;
    });
  });

  return <Table class={_class} headers={translated_day_names} rows={dates} />;
});
