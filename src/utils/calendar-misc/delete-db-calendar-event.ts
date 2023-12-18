import UserModel from "../../models/user-model"

export default async function deleteDBCalendarEvent (
	user: User,
	calendarId: string,
	deleteType: "hard" | "soft"
): Promise <void> {
	try {
		if (deleteType === "soft") {
			await UserModel.updateOne(
				{ _id: user._id, "calendarData.id": calendarId, "calendarData.isActive": true },
				{ $set: { "calendarData.$.isActive": false } }
			)
		} else {
			await UserModel.updateOne(
				{ _id: user._id },
				{ $pull: { calendarData: { id: calendarId } } }
			)
		}

		return
	} catch (error) {
		console.error(error)
		throw new Error("Failed to delete event")
	}
}
