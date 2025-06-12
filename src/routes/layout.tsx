import { component$, Slot, useContextProvider } from "@builder.io/qwik";
import { routeLoader$, type RequestHandler } from "@builder.io/qwik-city";

import { selected_date_context } from "~/contexts/date";
import { selected_locale_context } from "~/contexts/locale";

import { LOCALE } from "~/helpers/date";
import { post } from "~/helpers/service";

import { API_ROUTE } from "~/types/api";

import type { API_refresh_response } from "~/types/api";


export const onRequest: RequestHandler = (async ({ cookie, params: { month, year }, sharedMap, url, redirect }) => {
  const has_jwt_refresh_cookie = !!cookie.get('jwt-refresh');
  const has_access_token = !!sharedMap.get('access_token');

  if (!has_access_token && has_jwt_refresh_cookie) {
    const response = await post(API_ROUTE.REFRESH);
    const data = await response.json() as API_refresh_response;

    sharedMap.set('access_token', data.access_token);
  }

  if (!url.pathname.startsWith('/login') && !has_jwt_refresh_cookie) {
    throw redirect(302, '/login');
  }
  
  if (has_jwt_refresh_cookie && (!year || !month)) {
    const date = new Date();

    throw redirect(302, new URL(`/${date.getFullYear()}/${date.getMonth() + 1}`, url).toString());
  }
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
  const selected_date = use_get_selected_date();
  const selected_locale = use_get_selected_locale();

  useContextProvider(selected_date_context, selected_date);
  useContextProvider(selected_locale_context, selected_locale);

  return <main class="kldr:flex kldr:min-h-screen"><Slot /></main>;
});