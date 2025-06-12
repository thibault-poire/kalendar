export enum API_ROUTE {
  LOGIN = 'authentication/login',
  REFRESH = 'authentication/refresh',
}

export type API_login_response = {
  access_token: string
}

export type API_refresh_response = API_login_response