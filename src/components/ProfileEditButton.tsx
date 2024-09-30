'use client';

import { z } from 'zod';
import { useModal } from '@/hooks/useModal';
import { ModalUpdateDetails } from '@/modals/ModalUpdateDetails';
import { UserProfileDetailsSchema } from '@/lib/schemas';
import { Button } from './ui/button';

type Props = {
  initialValues: z.infer<typeof UserProfileDetailsSchema>;
};

export function ProfileEditButton(props: Props) {
  const [isOpen, toggle] = useModal();

  return (
    <>
      <Button
        className='w-fit self-end rounded px-3 py-2 active:scale-95 md:px-4'
        onClick={toggle}
      >
        Editar perfil
      </Button>

      <ModalUpdateDetails
        isOpen={isOpen}
        onClose={toggle}
        initialValues={props.initialValues}
      />
    </>
  );
}
