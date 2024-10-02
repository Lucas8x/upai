import Image from 'next/image';
import Link from 'next/link';
import { filesize } from 'filesize';
import { TbCalendarFilled, TbStack2Filled } from 'react-icons/tb';
import { MAX_IMAGES_IN_SLIDE } from '@/constants';
import { dayjs } from '@/utils/dayjs';
import { MediaCardDeleteButton } from './MediaCardDeleteButton';

type File = {
  url: string;
  blurHash?: string | null;
  size: number;
};

type MediaCardProps = {
  postID: string;
  title: string;
  files: File[];
  createdAt: Date;
  isOwnerProfile?: boolean;
};

export function MediaCard({
  postID,
  title,
  files,
  createdAt,
  isOwnerProfile,
}: MediaCardProps) {
  const isSingleMedia = files.length === 1;
  const slides = files.slice(0, MAX_IMAGES_IN_SLIDE);
  const postSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className='flex flex-col'>
      <Link href={`/post/${postID}`}>
        <div
          className='group peer relative h-40 w-[300px] overflow-hidden rounded hover:rounded-none hover:rounded-t'
          title={title}
        >
          {slides.map((f, index) => (
            <Image
              key={f.url}
              src={f.url}
              alt={title}
              width='300'
              height='160'
              className='absolute left-0 top-0 aspect-video animate-hover-slide paused group-hover:running'
              //loading={index === 0 ? 'eager' : 'lazy'}
              //priority={index === 0}
              fetchPriority={index === 0 && !isSingleMedia ? 'high' : 'low'}
              blurDataURL={
                f?.blurHash ? `data:image/webp;base64,${f.blurHash}` : undefined
              }
              placeholder='blur'
              style={{
                zIndex: MAX_IMAGES_IN_SLIDE - index,
                animationDuration: `${slides.length}s`,
                ...(index > 0 && {
                  animationDelay: `${index}s`,
                }),
              }}
            />
          ))}
        </div>

        {!isSingleMedia && (
          <div className='group invisible -mt-1 h-2 bg-neutral-50/30 peer-hover:visible'>
            <div
              className='h-2 animate-progress bg-neutral-50/40 paused group-[.invisible]:running'
              style={{
                animationDuration: `${slides.length}s`,
                animationDelay: '0',
              }}
            />
          </div>
        )}

        <div className='flex flex-col'>
          <p className='text-sm font-semibold'>{title}</p>

          <div className='flex justify-between'>
            <span
              className='flex items-center gap-1 text-xs text-neutral-400'
              title={dayjs(createdAt).toString()}
            >
              <TbCalendarFilled size={15} />
              {dayjs(createdAt).fromNow()}
            </span>

            <span className='flex items-center gap-1 text-xs text-neutral-400'>
              <TbStack2Filled size={15} />
              {files.length}
            </span>
          </div>
        </div>
      </Link>

      {isOwnerProfile && (
        <div className='flex items-center justify-between'>
          <MediaCardDeleteButton postID={postID} title={title} />
          <span className='text-xs text-neutral-400' title={filesize(postSize)}>
            {filesize(postSize)}
          </span>
        </div>
      )}
    </div>
  );
}
