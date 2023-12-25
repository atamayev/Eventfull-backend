import { Types } from "mongoose"
import UserModel from "../../models/user-model"

export default async function addCloudEventToDb (
	userId: Types.ObjectId,
	calendarDetails: UnifiedCalendarEvent,
	source: "google" | "microsoft"
): Promise<void> {
	try {
		calendarDetails.source = source
		calendarDetails.isActive = true
		calendarDetails.timeZone ||= "America/New_York"

		await UserModel.findByIdAndUpdate(
			userId,
			{ $push: { calendarData: calendarDetails } },
			{ runValidators: true }
		)
	} catch (error) {
		console.error(error)
		throw new Error("Unable to add Google Calendar event to DB")
	}
}
