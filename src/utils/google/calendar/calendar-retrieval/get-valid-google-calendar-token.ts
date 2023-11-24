import _ from "lodash"
import { Types } from "mongoose"
import getGoogleCalendarTokensFromDB from "./get-google-calendar-tokens-from-db"
import refreshGoogleCalendarToken from "./refresh-google-calendar-token"

export default async function getValidGoogleCalendarAccessToken(userId: Types.ObjectId): Promise<string | undefined> {
	const tokens = await getGoogleCalendarTokensFromDB(userId)
	if ((_.isUndefined(tokens)) ||
		(_.isUndefined(tokens.calendarRefreshToken))
	) return undefined

	let { calendarAccessToken } = tokens
	const { calendarTokenExpiryDate, calendarRefreshToken } = tokens

	const currentTime = new Date()

	if (_.isUndefined(calendarTokenExpiryDate)) return undefined

	if (currentTime >= calendarTokenExpiryDate) {
		const response = await refreshGoogleCalendarToken(userId, calendarRefreshToken)
		if (_.isNil(response)) return undefined
		calendarAccessToken = response
	}

	return calendarAccessToken
}
