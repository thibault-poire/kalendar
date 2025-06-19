export type API_login_response = {
  access_token: string
}

export type API_refresh_response = API_login_response

export type API_get_user_response = {
  _id: string,
  mail: string,
  username: string,
  created_at: string,
  updated_at: string,
}