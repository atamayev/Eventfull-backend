import _ from "lodash"
import { Credentials } from "google-auth-library"
import { UserModel } from "../../../models/user-model"
import addGoogleUserToDB from "../add-google-auth-user-to-db"

export default async function saveGoogleLoginTokens(email: string, tokens: Credentials): Promise<void> {
	let user = await UserModel.findOne({ email })

	if (_.isNull(user)) user = await addGoogleUserToDB(email)

	if (!_.isNil(tokens.access_token)) {
		user.googleLoginAccessToken = tokens.access_token
	}

	if (!_.isNil(tokens.refresh_token)) {
		user.googleLoginRefreshToken = tokens.refresh_token
	}

	if (!_.isNil(tokens.expiry_date)) {
		user.googleLoginAccessTokenExpiryDate = new Date(tokens.expiry_date)
	}

	await user.save()
}
