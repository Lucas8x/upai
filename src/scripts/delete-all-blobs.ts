import { list, del, type ListBlobResult } from '@vercel/blob';

async function deleteAllBlobs() {
  let cursor;

  do {
    const listResult: ListBlobResult = await list({
      cursor,
      limit: 1000,
    });

    if (listResult.blobs.length > 0) {
      await del(listResult.blobs.map((blob) => blob.url));
    }

    cursor = listResult.cursor;
  } while (cursor);

  console.log('All blobs were deleted');
}

deleteAllBlobs().catch((error) => {
  console.error('[DELETE-ALL-BLOBS] An error occurred:', error);
});
