import _ from "lodash"
import { TokenPayload, Credentials } from "google-auth-library"
import UserModel from "../../../models/user-model"
import addNonLocalUserToDB from "../../auth-helpers/add-non-local-auth-user-to-db"

// eslint-disable-next-line complexity
export default async function saveGoogleLoginTokens(
	payload: TokenPayload | undefined,
	tokens: Credentials
): Promise<{googleUser: User, isNewUser: boolean} | null | undefined> {
	try {
		const { access_token, refresh_token, expiry_date } = tokens
		const email = payload?.email
		let isNewUser = false
		if (_.isUndefined(email)) throw new Error("No email found in Google Login Callback")

		const firstName = payload?.given_name || ""
		const lastName = payload?.family_name || ""

		let googleUser = await UserModel.findOne({
			email: { $regex: `^${email}$`, $options: "i" }
		})

		if (!_.isNull(googleUser) && googleUser.authMethod !== "google") {
			return undefined
		}

		if (_.isNull(googleUser)) {
			googleUser = await addNonLocalUserToDB(email, firstName, lastName, "google")
			isNewUser = true
		}

		const updateLoginData: Record<string, string | Date> = {}

		if (!_.isNil(access_token)) updateLoginData.googleLoginAccessToken = access_token
		if (!_.isNil(refresh_token)) updateLoginData.googleLoginRefreshToken = refresh_token
		if (!_.isNil(expiry_date)) updateLoginData.googleLoginAccessTokenExpiryDate = new Date(expiry_date)

		if (!_.isEmpty(updateLoginData)) {
			await UserModel.findByIdAndUpdate(
				googleUser._id,
				{ $set: updateLoginData },
				{ runValidators: true }
			)
		}

		return { googleUser, isNewUser }
	} catch (error) {
		console.error("Error saving googleUser tokens to DB:", error)
		return null
	}
}
