import { component$, Slot, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";

import { selected_date_context } from "~/contexts/date";
import { selected_locale_context } from "~/contexts/locale";
import { connected_user_context } from "~/contexts/user";

import { request } from "~/helpers/request";

import { REFRESH_TOKEN_COOKIE_NAME } from "~/types/constant";

import { API_ROUTE } from "~/types/api.enum";
import { LOCALE } from "~/types/locale.enum";

import type { API_get_user_response } from "~/types/api.type";

import { Header } from "~/components/header/header";

export const onRequest: RequestHandler = (async ({ cookie, params: { month, year }, url, redirect }) => {
  const refresh_token_cookie = cookie.get(REFRESH_TOKEN_COOKIE_NAME);
  const has_refresh_token_cookie = !!refresh_token_cookie;
  const has_access_token = request.has_access_token();

  request.set_cookie_helper(cookie);

  if (!has_access_token && has_refresh_token_cookie) {
    request.set_refresh_token(refresh_token_cookie.value);

    await request.update_refresh_token();
  }

  if (!url.pathname.startsWith('/login') && !has_refresh_token_cookie) {
    throw redirect(302, '/login');
  }
  
  if (has_refresh_token_cookie && (!year || !month)) {
    const date = new Date();

    throw redirect(302, new URL(`/${date.getFullYear()}/${date.getMonth() + 1}`, url).toString());
  }
});

export const use_get_connected_user = routeLoader$(async () => {
  if (request.has_access_token()) {
    const { sub: user_id } = request.get_decoded_access_token();

    const user = await request.get<API_get_user_response>(API_ROUTE.USERS, user_id);
    
    return user;
  }

  return null;
});

export const use_get_selected_date = routeLoader$(({ params: { month, year } }) => {
  if (month && year) {
    return new Date(`${year}-${month}`);
  }

  return new Date();
});

export const use_get_selected_locale = routeLoader$(() => {
  return LOCALE.EN_GB;
});


export default component$(() => {
  const connected_user= use_get_connected_user();
  const selected_date = use_get_selected_date();
  const selected_locale = use_get_selected_locale();

  useContextProvider(connected_user_context, connected_user);
  useContextProvider(selected_date_context, selected_date);
  useContextProvider(selected_locale_context, selected_locale);

  return <div class="kldr:flex kldr:flex-col kldr:min-h-screen">
    <Header />

    <main class="kldr:flex">
      <Slot />
    </main>
  </div>;
});