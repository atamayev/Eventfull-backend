import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function doesUserHaveGoogleCalendar (userId: Types.ObjectId): Promise<boolean> {
	try {
		const user = await UserModel.findById(userId)
		return user?.googleCalendarAccessToken !== undefined

	} catch (error) {
		console.error(error)
		return false
	}
}
