import _ from "lodash"
import { Types } from "mongoose"
import getGoogleCalendarTokensFromDB from "./get-google-calendar-tokens-from-db"
import refreshGoogleCalendarToken from "./refresh-google-calendar-token"

export default async function getValidGoogleCalendarAccessToken(userId: Types.ObjectId): Promise<string | null | undefined> {
	const tokens = await getGoogleCalendarTokensFromDB(userId)
	if (_.isUndefined(tokens)) return undefined

	let { calendarAccessToken } = tokens
	const { calendarRefreshToken, calendarTokenExpiryDate } = tokens

	const currentTime = new Date()

	if (currentTime >= calendarTokenExpiryDate) {
		const response = await refreshGoogleCalendarToken(userId, calendarRefreshToken)
		if (_.isNil(response)) return null
		calendarAccessToken = response
	}

	return calendarAccessToken
}
