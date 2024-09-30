import Image from 'next/image';
import Link from 'next/link';
import {
  TbCalendarFilled,
  TbStack2Filled,
  TbDownload,
  TbUserFilled,
} from 'react-icons/tb';
import { dayjs } from '@/utils/dayjs';
import { getPostPageData } from '@/routes/get-post-page-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PostComment } from '@/components/Comment';
import { MediaCarousel } from '@/components/MediaCarousel';
import { ZipDownloadBtn } from '@/components/ZIpDownloadBtn';
import { CommentWriter } from '@/components/CommentWriter';
import { auth } from '../../../../auth';

type Props = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: Props) {
  const session = await auth();
  const isAuthenticated = session?.user;
  const { id } = params;

  const post = await getPostPageData(id);

  if (!post) {
    return (
      <div>
        <h3>Post not found</h3>
      </div>
    );
  }

  const isSingleMedia = post.files.length === 1;
  const extname = post.files[0].url.split('.').pop();

  return (
    <div className='mt-2 flex min-h-screen justify-center pt-14'>
      <div className='flex w-full max-w-6xl flex-col items-center px-4'>
        <h3 className='w-full rounded-t-md bg-neutral-900 py-2 text-center text-xl font-bold'>
          {post.title}
        </h3>

        <div className='flex h-[500px] w-full max-w-6xl'>
          <MediaCarousel files={post.files} title={post.title} />
          {/* <Carousel className='w-full'>
            <CarouselContent>
              {post.files.map((file, index) => {
                const blurData = file.blurHash
                  ? `data:image/webp;base64,${file.blurHash}`
                  : '';

                return (
                  <CarouselItem
                    key={file.id}
                    className='relative flex h-[500px] w-full items-center justify-center bg-cover bg-center bg-no-repeat'
                    style={{
                      backgroundImage: `url(${blurData})`,
                    }}
                  >
                    <Image
                      className='h-full rounded-md object-contain'
                      sizes='100vw'
                      fill
                      src={file.url}
                      alt={post.title}
                      fetchPriority={index === 0 ? 'high' : 'low'}
                      placeholder={blurData ? 'blur' : 'empty'}
                      blurDataURL={blurData}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel> */}
        </div>

        <div className='flex w-full flex-col gap-2 rounded-b-md bg-neutral-900 p-4'>
          <Link
            href={`/profile/${post.user.id}`}
            className='flex items-center gap-2'
          >
            {post.user.image ? (
              <Image
                className='size-8 rounded-full'
                src={post.user.image}
                alt={post.user.name ?? 'Unknown'}
                width={32}
                height={32}
              />
            ) : (
              <div className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-black'>
                <TbUserFilled className='text-xl' />
              </div>
            )}
            <p className='text-md font-semibold'>
              {post.user.name ?? 'Unknown'}
            </p>
          </Link>

          <div className='flex'>
            <span>{post.description}</span>
          </div>

          <div className='flex items-center gap-2'>
            <span className='font-medium'>Download:</span>
            {isSingleMedia ? (
              <a
                className='rounded-md bg-neutral-800 px-4 py-2 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:hover:bg-neutral-800'
                href={post.files[0].url}
                download={post.files[0].url.split('/').pop()}
                target='_blank'
                rel='noopener noreferrer'
              >
                .{extname}
              </a>
            ) : (
              <ZipDownloadBtn
                zipName={post.title}
                urls={post.files.map((f) => f.url)}
              />
            )}
          </div>

          <div className='flex gap-2 md:justify-end'>
            <div className='flex items-center gap-2'>
              <TbCalendarFilled size={18} />
              <span className='text-neutral-300'>
                {dayjs(post.createdAt).format('DD/MM/YY')}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <TbStack2Filled size={18} />
              <span className='text-neutral-300'>{post.files.length}</span>
            </div>
          </div>
        </div>

        <div className='mt-4 flex w-full flex-col gap-2'>
          <p className='font-bold'>Comentários</p>

          {isAuthenticated && <CommentWriter postID={post.id} />}

          <div className='flex w-full flex-col gap-2'>
            {post.comments.map((c) => (
              <PostComment
                key={c.id}
                user={c.user}
                content={c.content}
                createdAt={c.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
