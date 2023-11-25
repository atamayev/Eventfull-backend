import _ from "lodash"
import UserModel from "../../../../models/user-model"
import addNonLocalUserToDB from "../../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveMicrosoftCalendarTokens(
	email: string,
	accessToken: string,
	refreshToken: string,
	expiryDate: number
): Promise<void> {
	try {
		let user = await UserModel.findOne({ email })

		if (_.isNull(user)) user = await addNonLocalUserToDB(email, "microsoft")

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
