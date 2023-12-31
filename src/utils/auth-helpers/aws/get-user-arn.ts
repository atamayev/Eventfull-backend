export default function getUserArn(primaryDevicePlatform: DevicePlatforms, user: User): string | undefined {
	if (primaryDevicePlatform === "ios") {
		return user.iosEndpointArn
	} else if (primaryDevicePlatform === "android") {
		return user.androidEndpointArn
	} else {
		throw new Error(`Platform ${primaryDevicePlatform} is not supported`)
	}
}
