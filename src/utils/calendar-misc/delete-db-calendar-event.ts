import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function deleteDBCalendarEvent (
	userId: Types.ObjectId,
	calendarId: string,
	deleteType: "hard" | "soft"
): Promise <void> {
	try {
		if (deleteType === "soft") {
			await UserModel.updateOne(
				{ _id: userId, "calendarData.id": calendarId, "calendarData.isActive": true },
				{ $set: { "calendarData.$.isActive": false } }
			)
		} else {
			await UserModel.findByIdAndUpdate(
				userId,
				{ $pull: { calendarData: { id: calendarId } } },
				{ runValidators: true }
			)
		}

		return
	} catch (error) {
		console.error(error)
		throw new Error("Failed to delete event")
	}
}
