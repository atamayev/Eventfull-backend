import _ from "lodash"
import { Types } from "mongoose"
import EventCategoryModel from "../../models/event-category-model"

export default async function findEventCategory(eventId: Types.ObjectId, select?: string): Promise<EventCategory | null> {
	let eventCategory
	if (!_.isUndefined(select)) {
		eventCategory = await EventCategoryModel.findById(eventId).select(select)
	} else {
		eventCategory = await EventCategoryModel.findById(eventId)
	}
	return eventCategory as EventCategory
}
