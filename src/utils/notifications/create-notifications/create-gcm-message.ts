export default function createGCMMessage(title: string, body: string, targetPage: string): string {
	const gcmMessage = {
		notification: {
			title: title,
			body: body
		},
		data: {
			targetPage
		}
	}

	const message = {
		default: title,
		GCM: JSON.stringify(gcmMessage)
	}

	return JSON.stringify(message)
}
