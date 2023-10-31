import _ from "lodash"
import { Credentials } from "google-auth-library"
import { UserModel } from "../../models/user-model"

export async function saveGoogleTokens(email: string, tokens: Credentials): Promise<void> {
	let user = await UserModel.findOne({ email })

	if (_.isNull(user)) user = await addGoogleUser(email)

	if (!_.isNil(tokens.access_token)) {
		user.googleAccessToken = tokens.access_token
	}

	if (!_.isNil(tokens.refresh_token)) {
		user.googleRefreshToken = tokens.refresh_token
	}

	if (!_.isNil(tokens.expiry_date)) {
		user.accessTokenExpiryDate = new Date(tokens.expiry_date)
	}

	await user.save()
}

type UserDocument = User & Document

async function addGoogleUser(email: string): Promise<UserDocument> {
	const newUser = await UserModel.create({
		email,
		authMethod: "google",
	})

	return newUser as UserDocument
}
