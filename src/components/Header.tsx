import Link from 'next/link';
import { auth } from '../../auth';
import { UploadLinkButton } from './UploadLinkButton';
import UserButton from './UserButton';
import { HiddenChildren } from './HiddenChildren';

export default async function Header() {
  const session = await auth();

  return (
    <div className='top-0 z-[6] h-0 md:sticky'>
      <header className='flex h-14 w-full items-center justify-between border-b border-neutral-500 bg-black px-4'>
        <Link href='/' className=''>
          <h1 className='text-2xl'>Upai</h1>
        </Link>

        <div className='flex items-center gap-4'>
          {session?.user && <UploadLinkButton />}

          <HiddenChildren paths={['/login', '/signup']}>
            <UserButton />
          </HiddenChildren>
        </div>
      </header>
    </div>
  );
}
