import _ from "lodash"
import { AuthenticationResult } from "@azure/msal-node"
import UserModel from "../../../../models/user-model"

export default async function updateMicrosoftCalendarTokensInDB(user: User, credentials: AuthenticationResult): Promise<void> {
	try {
		const { accessToken, expiresOn } = credentials

		const updateData: Record<string, unknown> = {}

		if (!_.isNil(accessToken)) updateData.microsoftCalendarAccessToken = accessToken

		if (!_.isNull(expiresOn)) updateData.microsoftCalendarAccessTokenExpiryDate = expiresOn

		if (!_.isEmpty(updateData)) {
			await UserModel.updateOne({ _id: user._id }, { $set: updateData })
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
		return
	}
}
