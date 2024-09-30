import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { auth } from '../../auth';

type Props = {
  children: React.ReactNode;
};

export default async function ProtectedRoute({ children }: Props) {
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      image: session.user.image,
    };
  }

  if (!session?.user) {
    return redirect('/404');
  }

  return (
    <SessionProvider basePath={'/auth'} session={session}>
      {children}
    </SessionProvider>
  );
}
