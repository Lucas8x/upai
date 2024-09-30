import Image from 'next/image';
import Link from 'next/link';
import { IoPersonCircleOutline, IoExitOutline } from 'react-icons/io5';
import { TbUserFilled } from 'react-icons/tb';
import { filesize } from 'filesize';
import { auth, signOut } from '../../auth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';
import { MAX_USER_STORAGE_SIZE } from '@/config';
import { formatHiddenEmail } from '@/utils/formatHiddenEmail';
import { getUserStorageUsage } from '@/routes/get-user-storage-usage';

export default async function UserButton() {
  const session = await auth();

  if (!session?.user || !session?.user.id) {
    return (
      <Link href='/login'>
        <button
          className='flex flex-row items-center gap-2 rounded bg-green-700 px-3 py-2 hover:bg-green-500 active:scale-95 md:px-4'
          type='button'
        >
          Login
        </button>
      </Link>
    );
  }

  const [_, userStorageSizeInKB] = await getUserStorageUsage(session.user.id);
  const currentUsagePercentage = userStorageSizeInKB
    ? (100 * userStorageSizeInKB) / MAX_USER_STORAGE_SIZE
    : 0;

  return (
    <Popover>
      <PopoverTrigger>
        {session?.user.image ? (
          <Image
            className='size-9 cursor-pointer rounded-full'
            src={session.user?.image ?? ''}
            alt={session.user?.name ?? ''}
            width={36}
            height={36}
          />
        ) : (
          <div className='flex size-9 cursor-pointer items-center justify-center rounded-full bg-neutral-900'>
            <TbUserFilled className='text-xl' />
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='flex flex-col items-center justify-center gap-4'
      >
        <div className='flex w-full flex-col items-center'>
          <span className='text-sm'>{session.user?.name}</span>
          {session.user?.email && (
            <span className='text-xs text-neutral-300'>
              {formatHiddenEmail(session.user.email)}
            </span>
          )}
        </div>

        <div className='flex w-full flex-col items-center gap-2'>
          <div className='h-2 w-1/2 rounded-md bg-neutral-300'>
            <div
              className='h-2 rounded-md bg-red-600'
              style={{ width: `${currentUsagePercentage || 0}%` }}
            ></div>
          </div>

          <span className='text-xs'>
            Você já usou: {filesize(userStorageSizeInKB || 0).split(' ')[0]} de{' '}
            {filesize(MAX_USER_STORAGE_SIZE)}
          </span>
        </div>

        <div className='flex w-full flex-col gap-2'>
          <Link href='/profile'>
            <PopoverClose className='flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm hover:bg-neutral-900'>
              <IoPersonCircleOutline className='size-5' />
              <button className='text-sm'>Meu perfil</button>
            </PopoverClose>
          </Link>

          <form
            action={async () => {
              'use server';
              await signOut({
                redirectTo: '/',
              });
            }}
            className='flex w-full justify-center'
          >
            <button
              className='flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm hover:bg-neutral-900'
              type='submit'
            >
              <IoExitOutline className='size-5' />
              Sair da conta
            </button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
