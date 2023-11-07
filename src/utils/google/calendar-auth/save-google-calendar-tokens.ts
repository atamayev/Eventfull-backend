import _ from "lodash"
import { Credentials } from "google-auth-library"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveGoogleCalendarTokens(email: string, tokens: Credentials): Promise<void> {
	let user = await UserModel.findOne({ email })

	if (_.isNull(user)) user = await addNonLocalUserToDB(email, "google")

	if (!_.isNil(tokens.access_token)) {
		user.googleCalendarAccessToken = tokens.access_token
	}

	if (!_.isNil(tokens.expiry_date)) {
		user.googleCalendarAccessTokenExpiryDate = new Date(tokens.expiry_date)
	}

	await user.save()
}
