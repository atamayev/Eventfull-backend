import _ from "lodash"
import { Types } from "mongoose"
import EventTypeModel from "../../models/event-type-model"

export default async function findEventType(eventId: Types.ObjectId, select?: string): Promise<EventType | null> {
	let eventType
	if (!_.isUndefined(select)) {
		eventType = await EventTypeModel.findById(eventId).select(select).lean()
	} else {
		eventType = await EventTypeModel.findById(eventId).lean()
	}
	return eventType as EventType
}
