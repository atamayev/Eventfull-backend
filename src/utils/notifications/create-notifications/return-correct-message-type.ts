import createGCMMessage from "./create-gcm-message"
import createAPNSMessage from "./create-apns-message"

// eslint-disable-next-line max-params
export default function returnCorrectMessageType(
	friendPrimaryDevicePlatform: DevicePlatforms,
	notificationHeader: string,
	notificationMessage: string,
	toScreen: FrontEndScreens,
	extraData?: Record<string, string>
): string {
	let message = ""
	if (friendPrimaryDevicePlatform === "android") {
		message = createGCMMessage(
			notificationHeader,
			notificationMessage,
			toScreen,
			extraData
		)
	} else if (friendPrimaryDevicePlatform === "ios") {
		message = createAPNSMessage(
			notificationHeader,
			notificationMessage,
			toScreen,
			extraData
		)
	} else {
		throw new Error(`Platform ${friendPrimaryDevicePlatform} is not supported`)
	}
	return message
}
