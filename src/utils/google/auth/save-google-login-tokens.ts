import _ from "lodash"
import { Types } from "mongoose"
import { Credentials } from "google-auth-library"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveGoogleLoginTokens(email: string, tokens: Credentials): Promise<Types.ObjectId | null> {
	try {
		const { access_token, refresh_token, expiry_date } = tokens
		let user = await UserModel.findOne({
			email: { $regex: `^${email}$`, $options: "i" }
		})

		if (_.isNull(user)) user = await addNonLocalUserToDB(email, "google")

		if (!_.isNil(access_token)) user.googleLoginAccessToken = access_token

		if (!_.isNil(refresh_token)) user.googleLoginRefreshToken = refresh_token

		if (!_.isNil(expiry_date)) user.googleLoginAccessTokenExpiryDate = new Date(expiry_date)

		await user.save()
		return user._id
	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
		return null
	}

}
