'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbArrowsDownUp } from 'react-icons/tb';

type SortSelectProps = {
  currentSort?: 'asc' | 'desc';
};

export function SortSelect({ currentSort }: SortSelectProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createPageURL(sort: string) {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-1'>
        <TbArrowsDownUp size={12} />
        <span className='text-xs font-medium text-slate-200'>Ordenar por</span>
      </div>

      <div className='rounded-md bg-neutral-900 text-sm'>
        <button
          className='rounded-l px-3 py-2 data-[active=true]:bg-neutral-700'
          key='desc'
          value='desc'
          data-active={currentSort === 'desc'}
          onClick={() => {
            window.location.href = createPageURL('desc');
          }}
          type='button'
        >
          Mais recentes
        </button>

        <button
          className='rounded-r px-3 py-2 data-[active=true]:bg-neutral-700'
          key='asc'
          value='asc'
          data-active={currentSort === 'asc'}
          onClick={() => {
            window.location.href = createPageURL('asc');
          }}
          type='button'
        >
          Mais antigos
        </button>
      </div>
    </div>
  );
}
