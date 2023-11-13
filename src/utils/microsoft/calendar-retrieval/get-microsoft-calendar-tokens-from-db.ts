import _ from "lodash"
import { Types } from "mongoose"
import UserModel from "../../../models/user-model"

export default async function getMicrosoftCalendarTokensFromDB(userId: Types.ObjectId):
Promise<
	{
		calendarAccessToken: string | undefined,
		calendarRefreshToken: string | undefined,
		calendarTokenExpiryDate: Date | undefined
	} | undefined>
{

	const user = await UserModel.findOne({ userId })

	if (_.isNull(user)) return undefined
	return {
		calendarAccessToken: user.microsoftCalendarAccessToken,
		calendarRefreshToken: user.microsoftCalendarRefreshToken,
		calendarTokenExpiryDate: user.microsoftCalendarAccessTokenExpiryDate
	}
}
