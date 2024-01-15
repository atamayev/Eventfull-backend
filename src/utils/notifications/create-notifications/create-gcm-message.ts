export default function createGCMMessage(
	title: string,
	body: string,
	targetPage: string,
	extraData?: Record<string, string>
): string {
	const gcmMessage = {
		notification: {
			title: title,
			body: body
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
