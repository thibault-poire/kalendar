import { createContextId } from '@builder.io/qwik';

import type { Signal } from '@builder.io/qwik';

export const selected_date_context = createContextId<Signal<Date>>('selected_date');
