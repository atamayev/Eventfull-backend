import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function addLocalCalendarEventToDB(userId: Types.ObjectId, calendarDetails: UnifiedCalendarEvent[]): Promise<void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNil(user)) throw new Error("User not found")

		for (const event of calendarDetails) {
			user.calendarData.push(event)
		}

		await user.save()
	} catch (error) {
		console.error(error)
		throw new Error("Failed to add calendar data")
	}
}
