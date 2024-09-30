import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '../../../auth';
import { UserAuthForms } from '@/components/UserAuthForms';

export default async function SignUp() {
  return redirect('/login');

  const session = await auth();

  if (session?.user) {
    return redirect('/');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <UserAuthForms formType='register' />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Upai | Registro',
};
