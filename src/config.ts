export const MAX_UPLOAD_FILE_SIZE = 1000 * 1000 * 1; // 1MB
export const MAX_USER_FILES = 5;
export const MAX_USER_STORAGE_SIZE = MAX_UPLOAD_FILE_SIZE * MAX_USER_FILES;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
export const ACCEPTED_VIDEO_TYPES = [];

export const POST_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 HOURS
