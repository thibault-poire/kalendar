export const string_to_object = (cookie: string) => {
  const [ name_value, ...options ] = cookie.split(';');
  const [ name, value ] = name_value.split('=');

  const formatted_options = options.reduce((previous, current) => {
    const [ name, value ] = current.split('=');

    return { ...previous, [decapitalize(name.trim())]: value ?? 'true' };
  }, {} as {[key: string]: string});

  return { name, value, options: formatted_options };
};

const decapitalize = ([ first_letter, ...letters ]: string) => {
  return `${first_letter.toLowerCase()}${letters.join('')}`;
};