import _ from "lodash"
import UserModel from "../../../models/user-model"

export default async function saveDefaultCalendarIdToDb(userId: string, id: string): Promise<void> {
	try {
		const user = await UserModel.findOne({ userId }) as User

		if (!_.isNil(id)) user.microsoftDefaultCalendarId = id

		await user.save()
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
