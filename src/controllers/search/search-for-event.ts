import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function searchForEventName(req: Request, res: Response): Promise<Response> {
	try {
		const eventName = req.params.eventName as string
		const user = req.user

		// Extract userIds from blockedUsers and blockedByUsers
		const blockedIds = [
			...user.blockedUsers.map(socialData => socialData.userId),
			...user.blockedByUsers.map(socialData => socialData.userId)
		]

		// eslint-disable-next-line security/detect-non-literal-regexp
		const regex = new RegExp(eventName, "i")

		const events = await EventfullEventModel.find({
			// Exclude users in the blocked lists:
			"organizer.userId": { $nin: blockedIds },
			eventName: regex
		}).select("eventName").limit(10)

		return res.status(200).json({ events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Search for Event Name" })
	}
}
