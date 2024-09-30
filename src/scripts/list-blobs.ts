import { list, ListBlobResult } from '@vercel/blob';

async function listAllBlobs() {
  let cursor;
  let total = 0;

  do {
    const listResult: ListBlobResult = await list({
      cursor,
      limit: 1000,
    });

    const items = listResult.blobs.map((blob) => {
      total += blob.size;
      return {
        path: blob.pathname,
        size: `${(blob.size / 1000).toFixed(1)} KB`,
      };
    });

    console.table(items);

    cursor = listResult.cursor;
  } while (cursor);
}

listAllBlobs().catch((error) => {
  console.error('[LIST-BLOBS] An error occurred:', error);
});
