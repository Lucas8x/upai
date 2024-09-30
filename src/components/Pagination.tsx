'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination as CNPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationProps = {
  currentPage: number;
  totalCount: number;
  perPage: number;
};

export function Pagination({
  currentPage,
  totalCount,
  perPage,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = Math.ceil(totalCount / perPage) || 1;
  const isFirstPage = currentPage === 0 || currentPage === 1;
  const canBack = !isFirstPage && currentPage > 0;
  const canNext = currentPage + 1 <= pages;

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(searchParams);

    if (pageNumber <= 1) {
      params.delete('page');
    } else {
      params.set('page', pageNumber.toString());
    }

    return `${pathname}?${params.toString()}`;
  }

  return (
    <CNPagination>
      <PaginationContent>
        {canBack && (
          <PaginationItem>
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          </PaginationItem>
        )}

        {Array(pages)
          .fill('')
          .map((_, index) => (
            <PaginationItem key={`pagination-item-${index}`}>
              <PaginationLink
                href={createPageURL(index + 1)}
                isActive={
                  (isFirstPage && index === 0) || index + 1 === currentPage
                }
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

        {canNext && (
          <PaginationItem>
            <PaginationNext href={createPageURL(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </CNPagination>
  );
}
