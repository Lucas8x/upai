import { createPortal } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { ModalBase } from './ModalBase';
import { deletePost } from '@/actions/delete-post';
import { Spinner } from '@/components/icons/spinner';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  postID: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ModalDeletePost({ postID, title, isOpen, onClose }: Props) {
  const { toast } = useToast();
  if (!isOpen) return null;

  async function handleConfirm() {
    const { success, error } = await deletePost(postID);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Não foi possível excluir esta publicação. Tente novamente',
      });
      return;
    }

    if (success) {
      toast({
        title: 'Publicação excluída com sucesso',
      });
      onClose();
    }
  }

  return createPortal(
    <ModalBase>
      <div className='mx-4 flex flex-col gap-4 rounded bg-zinc-900 p-6 text-center'>
        <span className='break-words'>
          Você tem certeza que deseja excluir {'\n'} esta publicação:
          <p className='mt-2 font-bold'>{title}</p>
        </span>

        <form action={handleConfirm}>
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </ModalBase>,
    document.body,
  );
}

function ActionButtons({ onClose }: { onClose: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className='flex justify-center gap-4'>
      <button
        className='rounded bg-zinc-800 p-2 text-zinc-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50'
        type='button'
        onClick={onClose}
        disabled={pending}
      >
        Cancelar
      </button>

      <button
        className='flex items-center gap-2 rounded bg-red-600 p-2 text-zinc-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50'
        type='submit'
        disabled={pending}
      >
        {pending && <Spinner />}
        <span>{pending ? 'Excluindo...' : 'Excluir'}</span>
      </button>
    </div>
  );
}
