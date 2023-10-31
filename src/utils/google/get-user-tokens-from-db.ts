import _ from "lodash"
import { Types } from "mongoose"
import { UserModel } from "../../models/user-model"

export default async function getUserTokensFromDB(userId: Types.ObjectId):
Promise<{ accessToken: string, refreshToken: string, expiryDate: Date } | undefined> {

	const user = await UserModel.findOne({ userId })

	if (_.isNull(user)) return undefined
	return {
		accessToken: user.googleAccessToken as string,
		refreshToken: user.googleRefreshToken as string,
		expiryDate: user.accessTokenExpiryDate as Date
	}
}
