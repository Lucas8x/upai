import { NextResponse } from 'next/server';
import { put, head, BlobAccessError } from '@vercel/blob';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '../../../../auth';
import { MAX_USER_STORAGE_SIZE } from '@/config';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/schemas';
import { getUserStorageUsage } from '@/routes/get-user-storage-usage';
//import { saveImageToDisk } from '@/utils/saveImageToDisk';
import { createBlurHash } from '@/utils/createBlurHash';
import { Prisma } from '@prisma/client';

type ProcessedFile = {
  filename: string;
  size: number;
  url: string;
  blurHash: string;
};

async function uploadAndBlurHash(files: File[]) {
  let processedFiles: ProcessedFile[] = [];

  for (const file of files) {
    const filename = `${crypto.randomUUID()}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url } = await put(filename, buffer, {
      access: 'public',
    });

    //const { size } = await head(url);

    const processedFile = {
      filename,
      size: file.size,
      url,
      blurHash: await createBlurHash(buffer),
    };

    processedFiles.push(processedFile);

    /* const diskSaved = await saveImageToDisk(filename, buffer);
    if (diskSaved) {
      filesIds.push(filename);
    } */
  }

  return processedFiles;
}

export const POST = auth(async (req): Promise<Response> => {
  try {
    if (!req.auth || !req.auth.user || !req.auth.user.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado.' },
        { status: 401 },
      );
    }
    const userId = req.auth.user.id;

    const formData = await req.formData();

    const result = postSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
      files: formData.getAll('files'),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: Object.values(result.error.formErrors.fieldErrors).flat() },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 401 },
      );
    }

    const [storageErr, userStorageSizeInKB] = await getUserStorageUsage(userId);

    if (storageErr || userStorageSizeInKB === null) {
      return NextResponse.json(
        { error: 'Erro ao obter o tamanho do armazenamento.' },
        { status: 500 },
      );
    }

    const { title, description, files } = result.data;

    const exceedsLimit =
      userStorageSizeInKB + files.reduce((acc, file) => acc + file.size, 0) >
      MAX_USER_STORAGE_SIZE;

    if (exceedsLimit) {
      return NextResponse.json(
        {
          error: 'O tamanho dos arquivos ultrapassa o limite de armazenamento.',
        },
        { status: 400 },
      );
    }

    const processedFiles = await uploadAndBlurHash(files as File[]);
    //TODO: Create thumbnails / reduce size

    const { id: postId } = await prisma.post.create({
      data: {
        title,
        description,
        files: {
          create: processedFiles,
        },
        userId,
      },
    });

    return NextResponse.json({ ok: true, postId });
  } catch (err) {
    console.error('[API/SAVE] An error occurred:', err);
    //if (err instanceof BlobAccessError) {}
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro desconhecido.' },
      { status: 500 },
    );
  }
});
