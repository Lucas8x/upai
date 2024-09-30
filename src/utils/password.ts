import bcrypt from 'bcrypt';

export async function saltAndHashPassword(pw: string) {
  return await bcrypt.hash(pw, 10);
}
