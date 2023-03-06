import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class MulterS3Service {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  async uploadImageToS3(
    file: Express.Multer.File,
    path: string,
    nickname: string,
  ): Promise<string> {
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${path}${Date.now()}_${nickname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await this.s3.upload(uploadParams).promise();
    return result.Key;
  }
}
