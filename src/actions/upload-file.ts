/* 'use server';

import fs from 'fs/promises';
import path from 'path';
import { auth } from '../../auth';
import { filesSchema, postSchema } from '@/lib/schemas';

const OUTPUT_PATH = 'G:/_CODING_/upai/output';

export async function uploadFiles(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'Você precisa estar autenticado.',
    };
  }

  const rawFormData = Object.fromEntries(formData);

  const formDataValidation = postSchema.safeParse(rawFormData);
  if (!formDataValidation.success) {
    return {
      success: false,
      error: formDataValidation.error.issues[0].message,
    };
  }

  const files = formData.getAll('files') as File[];

  const filesValidation = filesSchema.safeParse(files);
  if (!filesValidation.success) {
    return {
      success: false,
      error: filesValidation.error.issues[0].message,
    };
  }

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(OUTPUT_PATH, file.name);
    await fs.writeFile(filePath, buffer);
  }

  console.log('processed files:', files.length);

  return {
    success: true,
    error: null,
  };
}
 */
