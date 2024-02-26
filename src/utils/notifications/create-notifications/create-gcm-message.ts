export default function createGCMMessage(notificationData: NotificationData): string {
	const { title, body, targetPage, deepLink, extraData } = notificationData

	const gcmMessage = {
		notification: {
			title,
			body
		},
		data: {
			targetPage,
			deepLink,
			...extraData
		}
	}

	const message = {
		default: title,
		GCM: JSON.stringify(gcmMessage)
	}

	return JSON.stringify(message)
}
