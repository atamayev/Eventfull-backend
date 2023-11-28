import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function updateUnifiedEventInDb (userId: Types.ObjectId, calendarDetails: UnifiedCalendarEvent): Promise<void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) throw new Error("User not found")

		const eventIndex = user.calendarData.findIndex(event => {
			return _.toString(event.id) === calendarDetails.id
		})

		if (eventIndex === -1) throw new Error("Event not found")

		calendarDetails.isActive = true

		// Update the specific event in the calendarData array
		const updatePath = `calendarData.${eventIndex}`
		await UserModel.updateOne(
			{ _id: userId },
			{ $set: { [updatePath]: calendarDetails } }
		)
	} catch (error) {
		console.error(error)
		throw new Error("Failed to update event")
	}
}
