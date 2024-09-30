import Image from 'next/image';
import Link from 'next/link';
import { dayjs } from '@/utils/dayjs';

type CommentProps = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  content: string;
  createdAt: Date;
};

export function PostComment({ user, content, createdAt }: CommentProps) {
  return (
    <div className='flex w-full flex-col rounded-md bg-neutral-900 p-4'>
      <Link
        href={`/profile/${user.id}`}
        className='flex w-fit items-center gap-2'
      >
        {user.image && (
          <Image
            className='size-6 rounded-full'
            src={user.image}
            alt={user.name ?? ''}
            width={24}
            height={24}
          />
        )}
        <span className='text-sm font-semibold'>{user.name ?? '???'}</span>
      </Link>

      <span className='mt-1 break-words'>{content}</span>

      <span className='text-end text-sm text-neutral-400'>
        {createdAt ? dayjs(createdAt).fromNow() : ''}
      </span>
    </div>
  );
}
