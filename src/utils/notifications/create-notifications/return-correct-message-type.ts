import createGCMMessage from "./create-gcm-message"
import createAPNSMessage from "./create-apns-message"

export default function returnCorrectMessageType(
	friendPrimaryDevicePlatform: DevicePlatforms,
	notificationHeader: string,
	notificationMessage: string,
	toScreen: FrontEndScreens
): string {
	let message = ""
	if (friendPrimaryDevicePlatform === "android") {
		message = createGCMMessage(
			notificationHeader,
			notificationMessage,
			toScreen
		)
	} else if (friendPrimaryDevicePlatform === "ios") {
		message = createAPNSMessage(
			notificationHeader,
			notificationMessage,
			toScreen
		)
	} else {
		throw new Error(`Platform ${friendPrimaryDevicePlatform} is not supported`)
	}
	return message
}
