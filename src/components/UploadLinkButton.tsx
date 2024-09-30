import Link from 'next/link';
import { TbCloudUpload } from 'react-icons/tb';

export function UploadLinkButton() {
  return (
    <Link href='/upload'>
      <button
        className='flex flex-row items-center gap-2 rounded bg-red-700 px-3 py-2 hover:bg-red-500 active:scale-95 md:px-4'
        type='button'
      >
        <span className='hidden md:block'>Enviar</span>

        <TbCloudUpload size={22} />
      </button>
    </Link>
  );
}
