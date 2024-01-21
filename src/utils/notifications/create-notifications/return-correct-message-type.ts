import createGCMMessage from "./create-gcm-message"
import createAPNSMessage from "./create-apns-message"

export default function returnCorrectMessageType(
	friendPrimaryDevicePlatform: DevicePlatforms,
	notificationData: NotificationData,
): string {
	let message = ""
	if (friendPrimaryDevicePlatform === "android") {
		message = createGCMMessage(notificationData)
	} else if (friendPrimaryDevicePlatform === "ios") {
		message = createAPNSMessage(notificationData)
	} else {
		throw new Error(`Platform ${friendPrimaryDevicePlatform} is not supported`)
	}
	return message
}
