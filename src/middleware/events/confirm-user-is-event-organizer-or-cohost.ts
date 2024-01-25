import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmUserIsEventOrganizerOrCohost(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const event = req.event

		if (_.isEqual(user._id, event.organizer.userId)) {
			req.organizerOrCoHost = "Organizer"
			next()
			return
		}
		const coHostIds = [...event.coHosts.map(coHost => coHost.user.userId.toString())]

		if (coHostIds.includes(user._id.toString()) === false) {
			return res.status(400).json({ message: "You are not authorized to modify this event" })
		}

		req.organizerOrCoHost = "Co-Host"
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify if User is an Event Organizer or Co-Host" })
	}
}
