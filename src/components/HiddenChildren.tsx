'use client';

import { usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  paths?: string[];
};

export function HiddenChildren({ children, paths }: Props) {
  const pathname = usePathname();

  if (paths?.includes(pathname)) {
    return null;
  }

  return children;
}
