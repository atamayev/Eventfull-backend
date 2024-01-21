export default function createAPNSMessage(
	title: string,
	body: string,
	targetPage: string,
	extraData?: Record<string, string>
): string {
	const apnsMessage = {
		aps: {
			alert: {
				title: title,
				body: body
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
