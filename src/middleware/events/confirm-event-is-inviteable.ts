import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function confirmEventIsInviteable(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { eventfullEventId } = req.body
		const event = await EventfullEventModel.findById(eventfullEventId).select("canInvitedUsersInviteOthers")
		if (_.isNull(event)) return res.status(400).json({ error: "Event not found" })

		const canInvitedUsersInviteOthers = event.canInvitedUsersInviteOthers
		if (canInvitedUsersInviteOthers === false) {
			return res.status(400).json({ error: "This event does not allow invited users to invite others" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
