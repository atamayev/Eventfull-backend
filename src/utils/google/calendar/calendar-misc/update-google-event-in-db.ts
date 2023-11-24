import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../../models/user-model"

export default async function updateGoogleEventInDb (userId: Types.ObjectId, calendarDetails: UnifiedCalendarEvent): Promise<void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) throw new Error("User not found")

		const eventIndex = user.calendarData.findIndex(event => {
			return _.toString(event.id) === calendarDetails.id
		})

		if (eventIndex === -1) throw new Error("Calendar event not found")

		calendarDetails.isActive = true

		user.calendarData[eventIndex] = calendarDetails

		await user.save()

		return
	} catch (error) {
		console.error(error)
		throw new Error("Failed to update calendar data")
	}
}
