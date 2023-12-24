import _ from "lodash"
import { Types } from "mongoose"
import { Credentials } from "google-auth-library"
import UserModel from "../../../../models/user-model"

export default async function updateGoogleCalendarTokensInDB(userId: Types.ObjectId, credentials: Credentials): Promise<void> {
	try {
		const { access_token, expiry_date } = credentials

		const updateData: Record<string, string | Date> = {}

		if (!_.isNil(access_token)) updateData.googleCalendarAccessToken = access_token
		if (!_.isNil(expiry_date)) updateData.googleCalendarAccessTokenExpiryDate = new Date(expiry_date)

		if (!_.isEmpty(updateData)) {
			await UserModel.findByIdAndUpdate(
				userId,
				{ $set: updateData },
				{ runValidators: true }
			)
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
		return
	}
}
