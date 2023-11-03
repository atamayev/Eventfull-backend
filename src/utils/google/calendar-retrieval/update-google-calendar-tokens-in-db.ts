import _ from "lodash"
import { Types } from "mongoose"
import { Credentials } from "google-auth-library"
import UserModel from "../../../models/user-model"

export default async function updateGoogleCalendarTokensInDB(userId: Types.ObjectId, credentials: Credentials): Promise<void> {
	try {
		const user = await UserModel.findOne({ userId })

		if (_.isNil(user)) return

		if (!_.isNil(credentials.access_token)) {
			user.googleCalendarAccessToken = credentials.access_token
		}

		if (!_.isNil(credentials.expiry_date)) {
			user.googleCalendarAccessTokenExpiryDate = new Date(credentials.expiry_date)
		}

		await user.save()
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
