import { S3 } from 'aws-sdk';

const s3 = new S3({
  region: 'us-east-1', // z.B. 'eu-central-1'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: 'bucket-mit-cooli-bilder', // Name deines S3 Buckets
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
    };

    try {
      const uploadURL = await s3.getSignedUrlPromise('putObject', params);
      res.status(200).json({ uploadURL });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating upload URL' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}