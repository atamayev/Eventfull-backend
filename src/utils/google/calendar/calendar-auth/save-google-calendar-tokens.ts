import _ from "lodash"
import { Credentials } from "google-auth-library"
import UserModel from "../../../../models/user-model"

export default async function saveGoogleCalendarTokens(email: string, tokens: Credentials): Promise<void> {
	try {
		const { access_token, refresh_token, expiry_date } = tokens

		const user = await UserModel.findOne({
			email: { $regex: `^${email}$`, $options: "i" }
		})

		if (_.isNull(user)) throw new Error("User not found")

		const updateCalendarData: Record<string, unknown> = {}

		if (!_.isNil(access_token)) updateCalendarData.googleCalendarAccessToken = access_token
		if (!_.isNil(refresh_token)) updateCalendarData.googleCalendarRefreshToken = refresh_token
		if (!_.isNil(expiry_date)) updateCalendarData.googleCalendarAccessTokenExpiryDate = new Date(expiry_date)

		if (!_.isEmpty(updateCalendarData)) {
			await UserModel.findByIdAndUpdate(
				user._id,
				{ $set: updateCalendarData },
				{ runValidators: true }
			)
		}
	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
	}
}
