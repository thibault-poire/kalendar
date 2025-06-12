import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { formAction$, useForm, valiForm$, type InitialValues } from "@modular-forms/qwik";

import * as v from 'valibot';

import { string_to_object } from "~/helpers/cookie";
import { post } from "~/helpers/service";

import { API_ROUTE } from "~/types/api";

import type { API_login_response } from "~/types/api";

const FormSchema = v.object({
  mail: v.pipe(v.string(), v.nonEmpty('can\'t be empty'), v.email("incorrect format")),
  password: v.pipe(v.string(), v.nonEmpty('can\'t be empty'))
});

type Form = v.InferInput<typeof FormSchema>

export const use_form_action = formAction$<Form>(async (values, { cookie, sharedMap, redirect }) => {
  const response = await post(API_ROUTE.LOGIN, values);
  const data = await response.json() as API_login_response;

  const set_cookies = response.headers.getSetCookie();

  set_cookies.forEach((set_cookie) => {
    const { name, value, options } = string_to_object(set_cookie);

    cookie.set(name, value, options);
  });

  sharedMap.set('access_token', data.access_token);

  redirect(302, "/");
}, valiForm$(FormSchema));

export const use_form_loader = routeLoader$<InitialValues<Form>>(() => ({
  mail: '',
  password: ''
}));

export default component$(() => {
  const [ , { Form, Field } ] = useForm<Form, {access_token: string}>({
    action: use_form_action(),
    loader: use_form_loader(),
    validate: valiForm$(FormSchema)
  });

  return <Form>
    <Field name="mail">
      {(field, props) => (
        <div>
          <label>Email</label>
          <input {...props} placeholder="enter your email" required type="email" value={field.value} />
          {field.error && <p>{field.error}</p>}
        </div>
      )}
    </Field>

    <Field name="password">
      {(field, props) => (
        <div>
          <label>Password</label>
          <input {...props} placeholder="enter your password" required type="password" value={field.value}/>
          {field.error && <p>{field.error}</p>}
        </div>
      )}
    </Field>


    <button type="submit">Login</button>
  </Form>;
});