import _ from "lodash"
import { Types } from "mongoose"
import { AuthenticationResult } from "@azure/msal-node"
import UserModel from "../../../models/user-model"

export default async function updateMicrosoftCalendarTokensInDB(userId: Types.ObjectId, credentials: AuthenticationResult): Promise<void> {
	try {
		const user = await UserModel.findOne({ userId })

		if (_.isNil(user)) return

		if (!_.isNil(credentials.accessToken)) {
			user.microsoftCalendarAccessToken = credentials.accessToken
		}

		if (!_.isNull(credentials.expiresOn)) {
			user.microsoftCalendarAccessTokenExpiryDate = credentials.expiresOn
		}

		await user.save()
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
	}
}
