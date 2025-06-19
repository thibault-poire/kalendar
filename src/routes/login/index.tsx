import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { formAction$, useForm, valiForm$, type InitialValues } from "@modular-forms/qwik";

import * as valibot from 'valibot';

import { request } from "~/helpers/request";


const FormSchema = valibot.object({
  mail: valibot.pipe(valibot.string(), valibot.nonEmpty('can\'t be empty'), valibot.email("incorrect format")),
  password: valibot.pipe(valibot.string(), valibot.nonEmpty('can\'t be empty'))
});

type Form = valibot.InferInput<typeof FormSchema>

export const use_form_action = formAction$<Form>(async ({ mail, password }, { redirect }) => {
  await request.login(mail, password);

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
          <input {...props} autocomplete="email" placeholder="enter your mail" required type="email" value={field.value} />
          {field.error && <p>{field.error}</p>}
        </div>
      )}
    </Field>

    <Field name="password">
      {(field, props) => (
        <div>
          <label>Password</label>
          <input {...props} autocomplete="current-password" placeholder="enter your password" required type="password" value={field.value}/>
          {field.error && <p>{field.error}</p>}
        </div>
      )}
    </Field>


    <button type="submit">Login</button>
  </Form>;
});