
import type { Cookie } from "@builder.io/qwik-city";

import { string_to_object } from "./cookie";

import { REFRESH_TOKEN_COOKIE_NAME } from "~/types/constant";

import { API_ROUTE } from "~/types/api.enum";

import type { API_login_response, API_refresh_response } from "~/types/api.type";


class Request {
  private access_token = '';
  private readonly base_url = import.meta.env.PUBLIC_API_URL;
  private refresh_token = '';
  private cookie_helper: Cookie | null = null;
  
  public has_access_token () {
    return !!this.access_token;
  }

  public async get <T>(route: API_ROUTE, id?: string, parameters?: {[key:string]: string}) {
    const url = new URL(id ? `${this.base_url}/${route}/${id}` : `${this.base_url}/${route}`);

    if (parameters) {
      url.search = new URLSearchParams(parameters).toString();
    }

    let response: Response;

    response = await fetch(url, { headers: { authorization: `Bearer ${this.access_token}` }, method: 'GET' });

    if (response.status === 401) {
      await this.update_refresh_token();

      response = await fetch(url, { headers: { authorization: `Bearer ${this.access_token}` }, method: 'GET' });
    }

    return await response.json() as T;
  }

  public get_decoded_access_token() {
    if (this.has_access_token()) {
      return JSON.parse(atob(this.access_token.split('.')[1]));
    }
  }

  public async login (mail: string, password: string) {
    const response = await fetch(`${this.base_url}/${API_ROUTE.LOGIN}`, { body: new URLSearchParams({ mail, password }), method: 'POST' });
    const { access_token } = await response.json() as API_login_response;

    this.set_cookies(response.headers.getSetCookie());
    this.set_access_token(access_token);
  }

  public set_access_token (access_token: string) {
    this.access_token = access_token;
  }

  private set_cookies (cookies: string[]) {
    cookies.forEach((cookie) => {
      const { name, value, options } = string_to_object(cookie);

      this.cookie_helper!.set(name, value, options);
    });
  }
  
  public set_cookie_helper (cookie_helper: Cookie) {
    this.cookie_helper = cookie_helper;
  }

  public set_refresh_token (refresh_token: string) {
    this.refresh_token = refresh_token;
  }

  public async update_refresh_token () {
    const response = await fetch(`${this.base_url}/${API_ROUTE.REFRESH}`, { credentials: "same-origin", method: 'POST', headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${this.refresh_token}` } });
    const { access_token } = await response.json() as API_refresh_response;

    this.set_cookies(response.headers.getSetCookie());
    this.set_access_token(access_token);
  }
}

export const request = new Request();