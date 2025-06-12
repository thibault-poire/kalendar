import { component$ } from "@builder.io/qwik";

type Props = {
  date: Date;
}

export const Day = component$(({ date }: Props) => {
  return <div>
    <time dateTime={date.toISOString()}>{date.getDate()}</time>
  </div>;
});