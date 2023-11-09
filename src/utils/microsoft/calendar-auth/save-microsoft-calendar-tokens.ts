import _ from "lodash"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveMicrosoftCalendarTokens(email: string, accessToken: string, expiryDate: Date): Promise<void> {
	try {
		let user = await UserModel.findOne({ email })

		if (_.isNull(user)) user = await addNonLocalUserToDB(email, "microsoft")

		if (!_.isNil(accessToken)) user.microsoftCalendarAccessToken = accessToken

		if (!_.isNil(expiryDate)) user.microsoftCalendarAccessTokenExpiryDate = expiryDate

		await user.save()

	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
	}
}
