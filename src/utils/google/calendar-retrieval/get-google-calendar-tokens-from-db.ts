import _ from "lodash"
import { Types } from "mongoose"
import { UserModel } from "../../../models/user-model"

export default async function getGoogleCalendarTokensFromDB(userId: Types.ObjectId):
Promise<{ calendarAccessToken: string, calendarRefreshToken: string, calendarTokenExpiryDate: Date } | undefined> {

	const user = await UserModel.findOne({ userId })

	if (_.isNull(user)) return undefined
	return {
		calendarAccessToken: user.googleCalendarAccessToken as string,
		calendarRefreshToken: user.googleCalendarRefreshToken as string,
		calendarTokenExpiryDate: user.googleCalendarAccessTokenExpiryDate as Date
	}
}
