export function get_path_for_next_month(date: Date) {
  return `/${date.getFullYear()}/${date.getMonth() + 1}`;
}

export function get_path_for_previous_month(date: Date) {
  return `/${date.getFullYear()}/${date.getMonth() - 1}`;
}