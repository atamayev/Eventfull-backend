/* eslint-disable no-inline-comments */

export default function createAPNSMessage(title: string, body: string, targetPage: string): string {
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
			targetPage
		}
	}

	const message = {
		default: title,
		APNS: JSON.stringify(apnsMessage), // For iOS in production
		APNS_SANDBOX: JSON.stringify(apnsMessage) // For iOS in sandbox/testing
	}

	return JSON.stringify(message)
}
