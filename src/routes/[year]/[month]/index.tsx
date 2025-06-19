import { $, component$, useComputed$, useContext, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

import { add_month_to_date, get_translated_date, subtract_month_to_date } from '~/helpers/date';

import { selected_date_context } from '~/contexts/date';
import { selected_locale_context } from '~/contexts/locale';

import { Month } from '~/components/month/month';
import { Selector } from '~/components/selector/selector';

import { LOCALE } from '~/types/locale.enum';

export default component$(() => {
  const selected_date = useContext(selected_date_context);
  const selected_locale = useContext(selected_locale_context);
  const navigate = useNavigate();

  const translated_date = useComputed$(() =>
    get_translated_date(selected_date.value, LOCALE.EN_GB, { with_month: true, with_year: true }),
  );

  useTask$(({ track }) => {
    const date = track(selected_date);

    navigate(`/${date.getFullYear()}/${date.getMonth() + 1}`);
  });

  const add_month = $(() => {
    const new_date = new Date(selected_date.value);

    selected_date.value = add_month_to_date(new_date);
  });

  const subtract_month = $(() => {
    const new_date = new Date(selected_date.value);

    selected_date.value = subtract_month_to_date(new_date);
  });

  return (
    <section class="kldr:flex kldr:flex-col kldr:w-1/2 kldr:p-[5%] kldr:gap-[5%]">
      <header>
        <Selector
          label={translated_date.value}
          next_button_label="next month"
          previous_button_label="previous month"
          on_next_click$={add_month}
          on_previous_click$={subtract_month}
        />
      </header>

      <Month class="kldr:h-auto kldr:text-center kldr:[&_tr]:grid kldr:[&_tr]:grid-cols-7 kldr:[&_th,&_td]:aspect-square" date={selected_date.value} locale={selected_locale.value} />
    </section>
  );
});
