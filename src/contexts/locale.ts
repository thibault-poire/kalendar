import { createContextId } from '@builder.io/qwik';

import type { Signal } from '@builder.io/qwik';
import type { LOCALE } from '~/types/locale.enum';

export const selected_locale_context = createContextId<Signal<LOCALE.EN_GB>>('selected_locale');
