import AWS = require('aws-sdk');
import { config } from './config/config';

// Configure AWS
// https://classroom.udacity.com/nanodegrees/nd9990/parts/f70c69d8-0ff1-438b-8a40-004ff0e6215d/modules/b5b1a27f-8d50-4666-8ea7-7a96e78e905a/lessons/423c3feb-2703-4ca0-9c40-e6dd3aec8b8c/concepts/10c66804-3271-44ff-b8e7-5e4377cc8bc6
// In production, the profile does not exists. Instead, the relevant permissions must be applied to EC2 instance service: https://stackoverflow.com/a/55245038/11964644
if (!config.isProduction) {
  const credentials = new AWS.SharedIniFileCredentials({ profile: config.aws_profile });
  AWS.config.credentials = credentials;

}
export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws_region,
  params: { Bucket: config.aws_media_bucket },
});

// Generates an AWS signed URL for retrieving objects
export function getGetSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('getObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}

// Generates an AWS signed URL for uploading objects
export function getPutSignedUrl(key: string): string {
  const signedUrlExpireSeconds = 60 * 5;

  return s3.getSignedUrl('putObject', {
    Bucket: config.aws_media_bucket,
    Key: key,
    Expires: signedUrlExpireSeconds,
  });
}
