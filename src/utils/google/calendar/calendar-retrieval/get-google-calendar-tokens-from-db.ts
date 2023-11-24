import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../../models/user-model"

export default async function getGoogleCalendarTokensFromDB(userId: Types.ObjectId):
Promise<{
	calendarAccessToken: string | undefined,
	calendarRefreshToken: string | undefined,
	calendarTokenExpiryDate: Date | undefined
} | undefined> {

	const user = await UserModel.findById(userId)

	if (_.isNull(user)) return undefined
	return {
		calendarAccessToken: user.googleCalendarAccessToken,
		calendarRefreshToken: user.googleCalendarRefreshToken,
		calendarTokenExpiryDate: user.googleCalendarAccessTokenExpiryDate
	}
}
