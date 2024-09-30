export function formatHiddenEmail(email: string) {
  return email.slice(0, 3) + '****' + email.slice(email.indexOf('@'));
}
