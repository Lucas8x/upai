import { LabelHTMLAttributes } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, ...props }: LabelProps) {
  return (
    <label className='text-sm font-medium' {...props}>
      {children}
    </label>
  );
}
