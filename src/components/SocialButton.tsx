'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { Spinner } from './icons/spinner';

type SocialButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export function SocialButton({
  children,
  icon,
  className,
  ...props
}: SocialButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn('disabled:cursor-not-allowed', className)}
      disabled={pending}
      {...props}
    >
      {pending ? <Spinner /> : icon}
      {children}
    </button>
  );
}
