import _ from "lodash"
import { Types } from "mongoose"
import { AuthenticationResult } from "@azure/msal-node"
import UserModel from "../../../../models/user-model"

export default async function updateMicrosoftCalendarTokensInDB(userId: Types.ObjectId, credentials: AuthenticationResult): Promise<void> {
	try {
		const { accessToken, expiresOn } = credentials

		const updateData: Record<string, string | Date> = {}

		if (!_.isNil(accessToken)) updateData.microsoftCalendarAccessToken = accessToken

		if (!_.isNull(expiresOn)) updateData.microsoftCalendarAccessTokenExpiryDate = expiresOn

		if (!_.isEmpty(updateData)) {
			await UserModel.findByIdAndUpdate(
				userId,
				{ $set: updateData },
				{ runValidators: true }
			)
		}
	} catch (error) {
		console.error("Error updating user tokens in DB:", error)
		return
	}
}
