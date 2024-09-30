import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '../../../auth';
import { UserAuthForms } from '@/components/UserAuthForms';

type PageProps = {
  searchParams: { error?: string };
};

export default async function Login({ searchParams }: PageProps) {
  const session = await auth();

  if (session?.user) {
    return redirect('/');
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <UserAuthForms formType='login' />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Upai | Login',
};
