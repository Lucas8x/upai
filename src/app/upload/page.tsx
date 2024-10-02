'use client';

import Dropzone from 'react-dropzone';
import { TbFileUpload, TbAlertTriangle } from 'react-icons/tb';
import { type FormEvent, useState } from 'react';
import imageCompression from 'browser-image-compression';

import { FilePreview } from '@/components/FilePreview';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_FILE_SIZE } from '@/config';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useRouter } from 'next/navigation';

type ProgressPerFile = {
  [key: string]: number;
};

type UploadSteps = 'upload' | 'compress' | 'success' | 'error' | '';

export default function UploadPageContent() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<UploadSteps>('');
  const [error, setError] = useState<string>('');

  const [progress, setProgress] = useState<ProgressPerFile>({});
  const isProcessing = ['compress', 'upload'].includes(step);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setError('');
      const formData = new FormData(e.currentTarget);

      const noNeedCompression = files.filter(
        (file) => file.size <= MAX_UPLOAD_FILE_SIZE,
      );
      const needCompression = files.filter(
        (file) => file.size > MAX_UPLOAD_FILE_SIZE,
      );
      const compressedFiles: File[] = [];

      setStep('compress');
      setProgress(
        noNeedCompression.reduce(
          (acc, file) => ({ ...acc, [file.name]: 100 }),
          {},
        ),
      );
      for (const file of needCompression) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          useWebWorker: true,
          maxWidthOrHeight: 1920,
          onProgress: (progress) => {
            setProgress((s) => ({ ...s, [file.name]: progress }));
          },
        });

        if (file instanceof Blob) {
          compressedFiles.push(
            new File([compressedFile], compressedFile.name, {
              type: compressedFile.type,
            }),
          );
        } else {
          compressedFiles.push(compressedFile);
        }
      }

      const finalFiles = [...noNeedCompression, ...compressedFiles];
      for (const file of finalFiles) {
        formData.append('files', file, file.name);
      }

      setStep('upload');
      const res = await fetch('/api/save', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Upload failed');
        setStep('error');
        setError(result.error);
        return;
      }

      setStep('success');
      router.push(`/post/${result.postId}`);
    } catch (error) {
      console.error(error);
      setStep('error');
    }
  }

  return (
    <div className='flex min-h-screen justify-center px-4 pt-16'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-sm flex-col gap-4'
      >
        {error && (
          <div className='flex w-full items-center justify-center rounded bg-red-600 p-4'>
            <TbAlertTriangle className='mr-4 size-14' />
            <span>{error}</span>
          </div>
        )}

        <div className='grid items-center gap-1.5'>
          <Label htmlFor='title'>Titulo</Label>
          <Input
            type='text'
            placeholder='Insira um titulo para essa postagem'
            id='title'
            name='title'
            required
          />
        </div>

        <div className='grid items-center gap-1.5'>
          <Label htmlFor='description'>Descrição</Label>
          <Textarea
            placeholder='Insira uma descrição para essa postagem'
            id='description'
            name='description'
            maxLength={1000}
          />
        </div>

        {files.length > 0 && (
          <div className='flex flex-col gap-2'>
            <span className='font-bold text-white'>
              Imagens: {files.length}
            </span>

            <div className='flex flex-col gap-y-2'>
              {files.map((f) => (
                <FilePreview
                  key={f.name}
                  file={f}
                  onRemove={() => {
                    if (isProcessing) return;
                    setFiles((s) => s.filter((sf) => sf !== f));
                  }}
                  isProcessing={isProcessing}
                  isCompleted={step === 'success'}
                  progress={progress[f.name] ?? 0}
                />
              ))}
            </div>
          </div>
        )}

        <Dropzone
          multiple
          accept={ACCEPTED_IMAGE_TYPES.reduce(
            (acc, type) => ({ ...acc, [type]: [] }),
            {},
          )}
          maxFiles={5}
          onDrop={(acceptedFiles) => {
            setFiles((s) => {
              if (s.length + acceptedFiles.length > 5) {
                return s;
              }
              return [...s, ...acceptedFiles];
            });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className='flex flex-col items-center border-2 border-dashed bg-neutral-900 p-4'
            >
              <TbFileUpload size={26} />
              <input {...getInputProps()} />
              <p className='text-center text-neutral-200'>
                Arraste e solte seu arquivo aqui, ou clique para selecionar
              </p>
            </div>
          )}
        </Dropzone>

        <button
          className='w-full rounded bg-green-600 px-4 py-2 font-bold tracking-wide text-white enabled:hover:bg-green-800 data-[submitting=true]:animate-pulse'
          type='submit'
          disabled={isProcessing}
          data-submitting={isProcessing}
        >
          {step === 'compress'
            ? 'Comprimindo....'
            : step === 'upload'
              ? 'Enviando....'
              : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
