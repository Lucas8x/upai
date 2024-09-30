import sharp from 'sharp';

export async function createBlurHash(buffer: Buffer) {
  const blurHash = await sharp(buffer).blur(1).resize(10).toBuffer();
  const blurHashBase64 = Buffer.from(blurHash).toString('base64');
  return blurHashBase64;
}
