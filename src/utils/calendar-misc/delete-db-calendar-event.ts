import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function deleteDBCalendarEvent (
	userId: Types.ObjectId,
	calendarId: string,
	deleteType: "hard" | "soft"
): Promise <void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) throw new Error("Failed to delete event")

		const event = user.calendarData.find(calendarEvent => calendarEvent.id === calendarId)

		if (_.isNil(event) || event.isActive === false) throw new Error("Failed to delete event")

		if (deleteType === "soft") event.isActive = false

		else {
			const eventIndex = user.calendarData.findIndex(calendarEvent => calendarEvent.id === calendarId)

			if (eventIndex === -1) throw new Error("Failed to delete event")

			user.calendarData.splice(eventIndex, 1)
		}

		await user.save()

		return
	} catch (error) {
		console.error(error)
		throw new Error("Failed to delete event")
	}
}
