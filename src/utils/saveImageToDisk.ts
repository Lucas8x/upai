import path from 'node:path';
import fs from 'node:fs/promises';

const outputPath = 'G:/_CODING_/upai/output';

export async function saveImageToDisk(filename: string, buffer: Buffer) {
  try {
    const filePath = path.join(outputPath, filename);
    await fs.writeFile(filePath, buffer);
    return true;
  } catch (error) {
    return false;
  }
}
