import _ from "lodash"
import UserModel from "../../../../models/user-model"

export default async function saveDefaultCalendarIdToDb(user: User, id: string): Promise<void> {
	try {
		if (!_.isNil(id)) {
			await UserModel.updateOne(
				{ _id: user._id },
				{ $set: { microsoftDefaultCalendarId: id } }
			)
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
