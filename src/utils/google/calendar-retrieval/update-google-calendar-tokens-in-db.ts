import _ from "lodash"
import { Types } from "mongoose"
import { Credentials } from "google-auth-library"
import UserModel from "../../../models/user-model"

export default async function updateGoogleCalendarTokensInDB(userId: Types.ObjectId, credentials: Credentials): Promise<void> {
	try {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { access_token, expiry_date } = credentials
		const user = await UserModel.findById(userId)

		if (_.isNil(user)) return

		if (!_.isNil(access_token)) user.googleCalendarAccessToken = access_token

		if (!_.isNil(expiry_date)) user.googleCalendarAccessTokenExpiryDate = new Date(expiry_date)

		await user.save()
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
