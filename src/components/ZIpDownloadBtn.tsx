'use client';

import { useState } from 'react';
import { Spinner } from './icons/spinner';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { createMediasZip } from '@/utils/createMediasZip';

type Props = {
  zipName: string;
  urls: string[];
};

export function ZipDownloadBtn({ zipName, urls }: Props) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  async function download() {
    setIsDownloading(true);

    const [err, blob] = await createMediasZip(urls);

    if (err || !blob) {
      toast({
        variant: 'destructive',
        title: 'Falha ao fazer download do ZIP.',
        action: (
          <ToastAction altText='Tentar Novamente' onClick={download}>
            Tentar Novamente
          </ToastAction>
        ),
      });
      setIsDownloading(false);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${zipName}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    setIsDownloading(false);
  }

  return (
    <button
      className='rounded-md bg-neutral-800 px-4 py-2 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:hover:bg-neutral-800'
      onClick={download}
      disabled={isDownloading}
      type='button'
    >
      {isDownloading ? <Spinner /> : '.zip'}
    </button>
  );
}
