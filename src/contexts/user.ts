import { createContextId } from "@builder.io/qwik";

import type { Signal } from "@builder.io/qwik";

import type { User } from "~/types/user.type";

export const connected_user_context = createContextId<Signal<User | null>>('connected_user');