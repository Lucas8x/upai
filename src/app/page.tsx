import type { Metadata } from 'next';
import { MediaCard } from '@/components/MediaCard';
import { Pagination } from '@/components/Pagination';
import { SortSelect } from '@/components/SortSelect';
import { POSTS_PER_PAGE, SORT_OPTIONS } from '@/constants';
import { getHomepagePosts } from '@/routes/get-homepage-posts';

type SearchParamsProps = {
  searchParams?: {
    page?: string;
    sort?: (typeof SORT_OPTIONS)[number];
  };
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const sort =
    searchParams?.sort && SORT_OPTIONS.includes(searchParams.sort)
      ? searchParams?.sort
      : 'desc';

  const currentPage = Number(searchParams?.page) || 1;

  const { posts, count } = await getHomepagePosts(
    (currentPage - 1) * POSTS_PER_PAGE,
    sort,
  );

  const hasPosts = posts.length > 0;

  return (
    <main className='flex h-full min-h-screen flex-col items-center gap-2 py-16 md:pb-8'>
      <div className='flex h-full w-full max-w-7xl flex-col justify-between gap-4 p-4 md:px-4 md:py-0 md:pb-8'>
        <div
          className='flex flex-col gap-4 data-[no-posts=true]:h-full'
          data-no-posts={!hasPosts}
        >
          <div className='flex flex-col items-center justify-between gap-2 md:flex-row'>
            <span className='text-lg font-medium'>
              {sort === 'asc' ? 'Mais Antigos' : 'Mais Recentes'} ({count})
            </span>

            <SortSelect currentSort={sort} />
          </div>

          {hasPosts ? (
            <div className='flex flex-wrap justify-center gap-4 md:justify-start'>
              {posts.map((i) => (
                <MediaCard
                  key={i.id}
                  postID={i.id}
                  title={i.title}
                  files={i.files}
                  createdAt={i.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className='flex h-full flex-col items-center justify-center text-4xl text-neutral-500'>
              <span>Sem publicações</span>
              <span>(◡︵◡)</span>
            </div>
          )}
        </div>

        {hasPosts && (
          <Pagination
            currentPage={currentPage}
            perPage={POSTS_PER_PAGE}
            totalCount={count}
          />
        )}
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Upai | Inicio',
};
