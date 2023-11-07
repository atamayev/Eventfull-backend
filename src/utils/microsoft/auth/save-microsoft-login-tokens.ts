import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveMicrosoftLoginTokens(
	email: string,
	accessToken: string,
	refreshToken: string,
	expiresIn: number
): Promise<Types.ObjectId> {
	let user = await UserModel.findOne({ email })

	if (_.isNull(user)) user = await addNonLocalUserToDB(email, "microsoft")

	if (!_.isNil(accessToken)) {
		user.microsoftLoginAccessToken = accessToken
	}

	if (!_.isNil(refreshToken)) {
		user.microsoftLoginRefreshToken = refreshToken
	}

	if (!_.isNil(expiresIn)) {
		const expirationTime = Math.floor(Date.now() / 1000) + expiresIn
		user.microsoftLoginAccessTokenExpiryDate = new Date(expirationTime)
	}

	await user.save()

	return user._id
}
