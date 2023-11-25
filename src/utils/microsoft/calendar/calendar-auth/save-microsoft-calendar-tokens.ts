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

		if (!_.isNil(accessToken)) user.microsoftCalendarAccessToken = accessToken

		if (!_.isNil(refreshToken)) user.microsoftCalendarRefreshToken = refreshToken

		if (!_.isNil(expiryDate)) {
			const expirationTime = Date.now() + expiryDate * 1000
			user.microsoftCalendarAccessTokenExpiryDate = new Date(expirationTime)
		}

		await user.save()

	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
	}
}
