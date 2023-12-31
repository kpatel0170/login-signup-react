// *
// * Amazon S3 service
// *

/* eslint-disable import/no-unresolved */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { config } from "dotenv";

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      region: "us-east-1", // To successfully create a new bucket, this SDK requires the region to be us-east-1
      endpoint: config.AWS_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY ?? ""
      }
    });
    this.bucketName = config.AWS_BUCKET_NAME ?? "";
  }

  async uploadImage(fileName, imageData) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: imageData,
      ContentType: "image/jpeg" // Change the content type based on your image type
    };
    const command = new PutObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }

  async downloadImage(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    const command = new GetObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);
      return response.Body; // Return image data
    } catch (error) {
      throw new Error(`Error downloading image: ${error.message}`);
    }
  }

  async uploadFile(fileName, fileData) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileData
    };
    const command = new PutObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      // Handle upload error
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async downloadFile(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    const command = new GetObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);
      return response.Body.toString(); // Assuming file content is text
    } catch (error) {
      // Handle download error
      throw new Error(`Error downloading file: ${error.message}`);
    }
  }

  async deleteFile(fileName) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    const command = new DeleteObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      // Handle deletion error
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}

export default S3Service;
