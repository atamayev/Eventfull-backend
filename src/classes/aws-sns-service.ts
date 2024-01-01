/* eslint-disable no-inline-comments */
import _ from "lodash"
import { SNS } from "@aws-sdk/client-sns"
import { CloudWatch } from "@aws-sdk/client-cloudwatch"
import getPlatformApplicationArn from "../utils/notifications/create-notifications/get-platform-application-arn"

export default class AwsSnsService {
	private static instance: AwsSnsService | null = null
	private sns: SNS
	private cloudWatch: CloudWatch

	private constructor() {
		this.sns = new SNS({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},

			region: process.env.AWS_REGION,
		})
		this.cloudWatch = new CloudWatch({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},

			region: process.env.AWS_REGION,
		})
	}

	static getInstance(): AwsSnsService {
		if (_.isNull(AwsSnsService.instance)) {
			AwsSnsService.instance = new AwsSnsService()
		}
		return AwsSnsService.instance
	}

	public async createPlatformEndpoint(token: string, primaryDevicePlatform: DevicePlatforms): Promise<string | undefined> {
		const platformApplicationArn = getPlatformApplicationArn(primaryDevicePlatform)
		const params = {
			PlatformApplicationArn: platformApplicationArn,
			Token: token,
		}

		try {
			const endpoint = await this.sns.createPlatformEndpoint(params)
			return endpoint.EndpointArn
		} catch (error) {
			console.error("Error creating platform endpoint:", error)
			throw error
		}
	}

	public async deletePlatformEndpoint (endpointArn: string | undefined): Promise<void> {
		try {
			if (_.isUndefined(endpointArn)) return
			await this.sns.deleteEndpoint({ EndpointArn: endpointArn })
		} catch (error) {
			console.error("Error deleting old endpoint:", error)
		}
	}

	public async sendNotification(endpointArn: string, message: string): Promise<void> {
		const params = {
			Message: message,
			MessageStructure: "json",
			TargetArn: endpointArn
		}

		try {
			await this.sns.publish(params)
		} catch (error) {
			console.error("Error sending message:", error)
			throw error
		}
	}
}
