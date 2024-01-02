export default function getUserArn(user: User): string | undefined {
	if (user.primaryDevicePlatform === "ios") {
		return user.iosEndpointArn
	} else if (user.primaryDevicePlatform === "android") {
		return user.androidEndpointArn
	} else {
		throw new Error(`Platform ${user.primaryDevicePlatform} is not supported`)
	}
}
