import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../../models/user-model"

export default async function saveDefaultCalendarIdToDb(userId: Types.ObjectId, id: string): Promise<void> {
	try {
		if (!_.isNil(id)) {
			await UserModel.updateOne(
				{ _id: userId },
				{ $set: { microsoftDefaultCalendarId: id } }
			)
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
