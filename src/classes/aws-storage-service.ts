import _ from "lodash"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export default class AwsStorageService {
	private static instance: AwsStorageService | null = null
	private s3: S3Client

	private constructor() {
		this.s3 = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},

			region: process.env.AWS_REGION,
		})
	}

	public static getInstance(): AwsStorageService {
		if (_.isNull(AwsStorageService.instance)) {
			AwsStorageService.instance = new AwsStorageService()
		}
		return AwsStorageService.instance
	}

	public async generatePresignedURL(imageUUID: string): Promise<string | undefined> {
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: `event-images/${imageUUID}`,
			ContentType: "image/jpeg",
		})

		try {
			const url = await getSignedUrl(this.s3, command, { expiresIn: 60 })
			return url
		} catch (error) {
			console.error("Error creating presigned URL:", error)
			throw error
		}
	}
}
