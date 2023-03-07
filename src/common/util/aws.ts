import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MulterS3Service {
  private s3;
  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  generateRandomString = (length: number): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  async uploadImageToS3(file: Express.Multer.File, path: string): Promise<any> {
    const fileSavePath = `${path}${Date.now()}_${this.generateRandomString(
      10,
    )}`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileSavePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // ACL 속성 추가
    };
    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);

    return { fileSavePath };
  }
}
