import { component$ } from '@builder.io/qwik';

import { clsx } from 'clsx';

import { HiArrowLeftSolid, HiArrowRightSolid } from '@qwikest/icons/heroicons';

import type { QRL } from '@builder.io/qwik';

type Props = {
  class?: string;
  label: string;
  next_button_label: string;
  previous_button_label: string;
  on_previous_click$: QRL<() => void>;
  on_next_click$: QRL<() => void>;
};

export const Selector = component$(
  ({ class: _class, label, next_button_label, previous_button_label, on_previous_click$, on_next_click$ }: Props) => {
    return (
      <div class={clsx('kldr:flex kldr:justify-between', _class)}>
        <button aria-label={next_button_label} class="kldr:cursor-pointer" type="button" onClick$={on_previous_click$}>
          <HiArrowLeftSolid />
        </button>

        {label}

        <button aria-label={previous_button_label} class="kldr:cursor-pointer" type="button" onClick$={on_next_click$}>
          <HiArrowRightSolid />
        </button>
      </div>
    );
  },
);
