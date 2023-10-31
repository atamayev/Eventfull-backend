import _ from "lodash"
import { Types } from "mongoose"
import getUserTokensFromDB from "./get-user-tokens-from-db"
import { refreshGoogleToken } from "./refresh-google-token"

export default async function getValidAccessToken(userId: Types.ObjectId): Promise<string | null | undefined> {
	const tokens = await getUserTokensFromDB(userId)
	if (_.isUndefined(tokens)) return undefined

	let { accessToken } = tokens
	const { refreshToken, expiryDate } = tokens

	const currentTime = new Date()

	if (currentTime >= expiryDate) {
		const response = await refreshGoogleToken(userId, refreshToken)
		if (_.isNil(response)) return null
		accessToken = response
	}

	return accessToken
}
