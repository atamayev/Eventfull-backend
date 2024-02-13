import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"
import determineEventStatus from "../../utils/events/determine-event-status"

export default async function searchForEventName(req: Request, res: Response): Promise<Response> {
	try {
		const eventName = req.params.eventName as string
		const user = req.user
		const currentTime = new Date()

		// Extract userIds from blockedUsers and blockedByUsers
		const blockedIds = [
			...user.blockedUsers.map(socialData => socialData.userId),
			...user.blockedByUsers.map(socialData => socialData.userId)
		]

		// eslint-disable-next-line security/detect-non-literal-regexp
		const regex = new RegExp(eventName, "i")

		let events = await EventfullEventModel.find({
			// Exclude users in the blocked lists:
			"organizer.userId": { $nin: blockedIds },
			isActive: true,
			eventName: regex
		})
			.select("_id eventName eventFrequency singularEventTime customEventDates ongoingEventTimes")
			.lean()
			.sort({ createdAt: -1 })
			.limit(10)

		events = events.map(event => {
			const whenIsEvent = determineEventStatus(event, currentTime)
			return { ...event, whenIsEvent }
		})

		return res.status(200).json({ events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Search for Event Name" })
	}
}
