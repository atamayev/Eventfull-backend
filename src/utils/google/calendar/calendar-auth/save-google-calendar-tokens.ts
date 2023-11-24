import _ from "lodash"
import { Credentials } from "google-auth-library"
import UserModel from "../../../../models/user-model"
import addNonLocalUserToDB from "../../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveGoogleCalendarTokens(email: string, tokens: Credentials): Promise<void> {
	try {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { access_token, refresh_token, expiry_date } = tokens
		let user = await UserModel.findOne({ email })

		if (_.isNull(user)) user = await addNonLocalUserToDB(email, "google")

		if (!_.isNil(access_token)) user.googleCalendarAccessToken = access_token

		if (!_.isNil(refresh_token)) user.googleCalendarRefreshToken = refresh_token

		if (!_.isNil(expiry_date)) user.googleCalendarAccessTokenExpiryDate = new Date(expiry_date)

		await user.save()

	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
	}
}
