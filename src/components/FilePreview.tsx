import { useMemo } from 'react';
import Image from 'next/image';
import { TbTrash, TbCheck } from 'react-icons/tb';
import { Spinner } from './icons/spinner';

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className='h-2 rounded bg-white'>
      <div
        className='h-2 rounded bg-green-700 data-[inprogress=true]:animate-pulse'
        style={{ width: `${progress}%` }}
        data-inprogress={progress < 100}
      ></div>
    </div>
  );
}

function TextPreview(props: {
  file: File;
  progress: number;
  isProcessing: boolean;
  isCompleted: boolean;
  onRemove: () => void;
}) {
  return (
    <div className='space-between flex w-full items-center justify-between gap-1'>
      <span className='truncate'>{props.file.name}</span>

      {!props.isProcessing && !props.isCompleted && props.progress < 100 && (
        <button onClick={props.onRemove} title='Remover este arquivo'>
          <TbTrash size={24} />
        </button>
      )}

      {props.progress > 0 && props.progress < 100 && (
        <div className='size-5'>
          <Spinner />
        </div>
      )}

      {props.progress === 100 && (
        <div className='size-5'>
          <TbCheck size={24} />
        </div>
      )}
    </div>
  );
}

function ImagePreview(props: {
  file: File;
  progress: number;
  onRemove: () => void;
}) {
  const imgSRC = useMemo(() => URL.createObjectURL(props.file), [props.file]);

  return (
    <div className='space-between flex w-fit flex-col items-center justify-between gap-1'>
      {imgSRC && (
        <Image
          className='aspect-square size-16 rounded-md'
          src={imgSRC}
          alt={props.file.name}
          width={64}
          height={64}
          loading='lazy'
          onLoad={() => URL.revokeObjectURL(imgSRC)}
        />
      )}

      <ProgressBar progress={props.progress} />
    </div>
  );
}

export function FilePreview(props: {
  file: File;
  progress: number;
  isProcessing: boolean;
  isCompleted: boolean;
  onRemove: () => void;
  style?: 'text' | 'image';
}) {
  return props.style === 'image' ? (
    <ImagePreview {...props} />
  ) : (
    <TextPreview {...props} />
  );
}
