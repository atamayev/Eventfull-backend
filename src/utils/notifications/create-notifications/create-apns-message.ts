export default function createAPNSMessage(notificationData: NotificationData): string {
	const { title, body, targetPage, extraData } = notificationData

	const apnsMessage = {
		aps: {
			alert: {
				title,
				body
			},
			sound: "default",
			badge: 1
		},
		data: {
			targetPage,
			...extraData
		}
	}

	const message = {
		default: title,
		APNS: JSON.stringify(apnsMessage), // For iOS in production
		APNS_SANDBOX: JSON.stringify(apnsMessage) // For iOS in sandbox/testing
	}

	return JSON.stringify(message)
}
