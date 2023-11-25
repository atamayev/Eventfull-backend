import _ from "lodash"
import { Types } from "mongoose"
import { AuthenticationResult } from "@azure/msal-node"
import UserModel from "../../../../models/user-model"

export default async function updateMicrosoftCalendarTokensInDB(userId: Types.ObjectId, credentials: AuthenticationResult): Promise<void> {
	try {
		const user = await UserModel.findById(userId)

		if (_.isNull(user)) return

		const { accessToken, expiresOn } = credentials

		if (!_.isNil(accessToken)) user.microsoftCalendarAccessToken = accessToken

		if (!_.isNull(expiresOn)) user.microsoftCalendarAccessTokenExpiryDate = expiresOn

		await user.save()
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
		return
	}
}