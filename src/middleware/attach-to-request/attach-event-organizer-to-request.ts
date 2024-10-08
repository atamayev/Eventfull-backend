import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import findUser from "../../utils/find/find-user"

export default async function attachEventOrganizerToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const eventOrganizerId = req.event.organizer?.userId
		if (_.isUndefined(eventOrganizerId)) return res.status(400).json({ message: "Event Organizer not found" })

		const eventOrganizer = await findUser(eventOrganizerId)

		if (_.isNull(eventOrganizer)) return res.status(400).json({ message: "Event Organizer not found" })

		req.eventOrganizer = eventOrganizer as User
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Event Organizer to Request" })
	}
}
