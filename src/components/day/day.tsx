import { component$ } from "@builder.io/qwik";

type Props = {
  class?: string;
  date: Date;
}

export const Day = component$(({ class: _class, date }: Props) => {
  return <div class={_class}>
    <time dateTime={date.toISOString()}>{date.getDate()}</time>
  </div>;
});