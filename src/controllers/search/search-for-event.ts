import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function searchForEventName(req: Request, res: Response): Promise<Response> {
	try {
		const eventName = req.params.eventName as string
		const user = req.user
		const blockedIds = [...user.blockedUsers, ...user.blockedByUsers]

		// eslint-disable-next-line security/detect-non-literal-regexp
		const regex = new RegExp(eventName, "i")

		const events = await EventfullEventModel.find({
			// Exclude users in the blocked lists:
			organizerId: { $nin: blockedIds },
			eventName: regex
		})
			.select("eventName")
			.limit(10)

		return res.status(200).json({ sucess: events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Search for Event Name" })
	}
}
