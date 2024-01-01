export default function getPlatformApplicationArn(platform: DevicePlatforms): string {
	if (platform === "ios") {
		return process.env.AWS_APNS_ARN
	} else if (platform === "android") {
		return process.env.AWS_FCM_ARN
	} else {
		throw new Error(`Platform ${platform} is not supported`)
	}
}
