import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

export default async function saveMicrosoftLoginTokens(
	email: string,
	accessToken: string,
	refreshToken: string,
	expiresIn: number
): Promise<Types.ObjectId | null> {
	try {
		let user = await UserModel.findOne({
			email: { $regex: `^${email}$`, $options: "i" }
		})

		// TODO: FIX THIS
		// After getting the user details, pass in the email, firstname, lastname, etc.
		if (_.isNull(user)) user = await addNonLocalUserToDB(email, "bob", "smith1231231", "microsoft")

		const updateData: Record<string, unknown> = {}

		if (!_.isNil(accessToken)) updateData.microsoftLoginAccessToken = accessToken
		if (!_.isNil(refreshToken)) updateData.microsoftLoginRefreshToken = refreshToken
		if (!_.isNil(expiresIn)) {
			const expirationTime = Date.now() + expiresIn * 1000
			updateData.microsoftLoginAccessTokenExpiryDate = new Date(expirationTime)
		}

		if (!_.isEmpty(updateData)) {
			await UserModel.findByIdAndUpdate(
				user._id,
				{ $set: updateData },
				{ runValidators: true }
			)
		}

		return user._id
	} catch (error) {
		console.error("Error saving user tokens to DB:", error)
		return null
	}
}
