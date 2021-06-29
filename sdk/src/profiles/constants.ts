const suffix = process.env.NODE_ENV === 'development' ? '-dev' : '-prod';
const bucketVersion = process.env.BUCKET_VERSION;
export const PROFILE_MEDIA_FILES = `awf-media-upload${suffix}${bucketVersion}`;
export const BUCKET_THREAD_NAME = `ewa-bucket${suffix}${bucketVersion}`;
