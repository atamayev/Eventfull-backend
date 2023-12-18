import _ from "lodash"
import UserModel from "../../models/user-model"

export default async function updateUnifiedEventInDb (user: User, calendarDetails: UnifiedCalendarEvent): Promise<void> {
	try {
		const eventIndex = user.calendarData.findIndex(event => {
			return _.toString(event.id) === calendarDetails.id
		})

		if (eventIndex === -1) throw new Error("Event not found")

		calendarDetails.isActive = true

		const updatePath = `calendarData.${eventIndex}`
		await UserModel.updateOne(
			{ _id: user._id },
			{ $set: { [updatePath]: calendarDetails } }
		)
	} catch (error) {
		console.error(error)
		throw new Error("Failed to update event")
	}
}
