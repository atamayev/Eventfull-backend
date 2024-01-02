import createGCMMessage from "./create-gcm-message"
import createAPNSMessage from "./create-apns-message"

export default function returnCorrectMessageType(friendPrimaryDevicePlatform: DevicePlatforms, userUsername: string): string {
	let message = ""
	if (friendPrimaryDevicePlatform === "android") {
		message = createGCMMessage(
			"New Friend Request",
			`${userUsername} sent you a friend request`,
			"Chat"
		)
	} else if (friendPrimaryDevicePlatform === "ios") {
		message = createAPNSMessage(
			"New Friend Request",
			`${userUsername} sent you a friend request`,
			"Chat"
		)
	} else {
		throw new Error(`Platform ${friendPrimaryDevicePlatform} is not supported`)
	}
	return message
}
