'use client';

import { useModal } from '@/hooks/useModal';
import { ModalDeletePost } from '@/modals/ModalDeletePost';

type Post = {
  postID: string;
  title: string;
};

export function MediaCardDeleteButton({ postID, title }: Post) {
  const [isOpen, toggle] = useModal();

  return (
    <>
      <button className='text-xs text-red-500' type='button' onClick={toggle}>
        Apagar
      </button>

      <ModalDeletePost
        postID={postID}
        title={title}
        isOpen={isOpen}
        onClose={toggle}
      />
    </>
  );
}
