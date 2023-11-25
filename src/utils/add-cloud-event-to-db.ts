import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../models/user-model"

export default async function addCloudEventToDb (
	userId: Types.ObjectId,
	calendarDetails: UnifiedCalendarEvent,
	source: "google" | "microsoft"
): Promise<void> {
	try {
		calendarDetails.source = source
		calendarDetails.isActive = true
		calendarDetails.timeZone ||= "America/New_York"

		const user = await UserModel.findById(userId)

		if (_.isNull(user)) return

		user.calendarData.push(calendarDetails)

		await user.save()
	} catch (error) {
		console.error(error)
		throw new Error("Failed to add Google Calendar event to DB")
	}
}
