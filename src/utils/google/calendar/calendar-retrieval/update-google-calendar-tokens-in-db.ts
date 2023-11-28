import _ from "lodash"
import { Types } from "mongoose"
import { Credentials } from "google-auth-library"
import UserModel from "../../../../models/user-model"

export default async function updateGoogleCalendarTokensInDB(userId: Types.ObjectId, credentials: Credentials): Promise<void> {
	try {
		const { access_token, expiry_date } = credentials

		const updateData: Record<string, unknown> = {}

		if (!_.isNil(access_token)) updateData.googleCalendarAccessToken = access_token
		if (!_.isNil(expiry_date)) updateData.googleCalendarAccessTokenExpiryDate = new Date(expiry_date)

		if (!_.isEmpty(updateData)) {
			await UserModel.updateOne({ _id: userId }, { $set: updateData })
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
		return
	}
}
