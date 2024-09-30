import { useState } from 'react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen((s) => !s);
  }

  return [isOpen, toggle] as const;
}
