export default function createGCMMessage(notificationData: NotificationData): string {
	const { title, body, targetPage, extraData } = notificationData

	const gcmMessage = {
		notification: {
			title,
			body
		},
		data: {
			targetPage,
			...extraData
		}
	}

	const message = {
		default: title,
		GCM: JSON.stringify(gcmMessage)
	}

	return JSON.stringify(message)
}
