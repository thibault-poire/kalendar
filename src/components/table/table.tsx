import { component$ } from '@builder.io/qwik';

type Props = {
  caption?: string;
  class?: string;
  headers: {long: string, short?: string}[];
  rows: (any)[][];
};

export const Table = component$(({ caption, class: _class, headers, rows }: Props) => {
  return (
    <table class={_class}>
      {caption && <caption>{caption}</caption>}

      <thead>
        <tr>
          {headers.map((header, header_index) => (
            <th key={header_index}>{
              header.short ? 
                <>
                  <span aria-hidden="true">{header.short}</span>
                  <span class="kldr:sr-only">{header.long}</span>
                </> 
                : header.long
              }
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((columns, row_index) => (
          <tr key={row_index}>
            {columns.map((column, column_index) => (
              <td key={`${row_index}-${column_index}`}>{column}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
