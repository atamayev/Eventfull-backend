import _ from "lodash"
import { Types } from "mongoose"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function findEvent(eventId: Types.ObjectId, select?: string): Promise<EventfullEvent | null> {
	let event
	if (!_.isUndefined(select)) {
		event = await EventfullEventModel.findById(eventId).select(select).lean()
	} else {
		event = await EventfullEventModel.findById(eventId).lean()
	}
	return event as EventfullEvent
}
