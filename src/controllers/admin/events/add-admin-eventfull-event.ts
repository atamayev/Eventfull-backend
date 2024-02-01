import _ from "lodash"
import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"
import convertAdminEventToEventfullEvent from "../../../utils/events/convert-admin-event-to-eventfull-event"

export default async function addAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent

		const eventfullEvent = convertAdminEventToEventfullEvent(admin, eventfullEventData)

		const newEvent = await EventfullEventModel.create(eventfullEvent)
		if (!_.isUndefined(newEvent.createdBy?.userId)) {
			newEvent.createdBy.userId = newEvent.createdBy.userId.toString()
		}

		return res.status(200).json({ newEvent })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
