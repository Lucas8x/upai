import JSZip from 'jszip';
import { z } from 'zod';

const responseSchema = z.array(
  z.object({
    status: z.string().refine((s) => s === 'fulfilled'),
    value: z.object({
      name: z.string(),
      blob: z.instanceof(Blob),
    }),
  }),
);

export async function createMediasZip(
  urls: string[],
): Promise<[null, Blob] | [Error | string, null]> {
  try {
    const zip = new JSZip();

    const files = await Promise.allSettled(
      urls.map(async (url) => {
        const response = await fetch(url, {
          cache: 'force-cache',
        });

        if (!response.ok) {
          return null;
        }

        const blob = await response.blob();

        if (!blob) {
          return null;
        }

        return {
          name: url.split('/').pop(),
          blob,
        };
      }),
    );

    const validationResult = responseSchema.safeParse(files);

    if (!validationResult.success) {
      return ['Some files could not be downloaded', null];
    }

    const { data } = validationResult;

    for (const { value } of data) {
      zip.file(value.name, value.blob, {
        compression: 'DEFLATE',
      });
    }

    const blob = await zip.generateAsync({ type: 'blob' });

    return [null, blob];
  } catch (error) {
    return [error as Error, null];
  }
}
