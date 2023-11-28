import _ from "lodash"
import UserModel from "../../../../models/user-model"

export default async function saveMicrosoftCalendarTokens(
	email: string,
	accessToken: string,
	refreshToken: string,
	expiryDate: number
): Promise<void> {
	try {
		const user = await UserModel.findOne({
			email: { $regex: `^${email}$`, $options: "i" }
		})
		if (_.isNull(user)) throw new Error("User not found")

		const updateCalendarData: Record<string, unknown> = {}

		if (!_.isNil(accessToken)) updateCalendarData.microsoftCalendarAccessToken = accessToken

		if (!_.isNil(refreshToken)) updateCalendarData.microsoftCalendarRefreshToken = refreshToken

		if (!_.isNil(expiryDate)) {
			const expirationTime = Date.now() + expiryDate * 1000
			updateCalendarData.microsoftCalendarAccessTokenExpiryDate = new Date(expirationTime)
		}

		if (!_.isEmpty(updateCalendarData)) {
			await UserModel.updateOne({ _id: user._id }, { $set: updateCalendarData })
		}
	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
	}
}
