export const config = {
  dbUrl: process.env.DATABASE_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET_NAME,
  }
};