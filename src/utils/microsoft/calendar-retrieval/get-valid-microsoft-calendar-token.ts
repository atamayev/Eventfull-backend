import _ from "lodash"
import { Types } from "mongoose"
import getMicrosoftCalendarTokensFromDB from "./get-microsoft-calendar-tokens-from-db"
import refreshMicrosoftCalendarToken from "./refresh-microsoft-calendar-token"

export default async function getValidMicrosoftCalendarAccessToken(userId: Types.ObjectId): Promise<string | undefined> {
	const tokens = await getMicrosoftCalendarTokensFromDB(userId)
	if ((_.isUndefined(tokens)) ||
		(_.isUndefined(tokens.calendarRefreshToken))
	) return undefined

	let { calendarAccessToken } = tokens
	const { calendarTokenExpiryDate, calendarRefreshToken } = tokens

	const currentTime = new Date()

	if (_.isUndefined(calendarTokenExpiryDate)) return undefined

	if (currentTime >= calendarTokenExpiryDate) {
		const response = await refreshMicrosoftCalendarToken(userId, calendarRefreshToken)
		if (_.isNil(response)) return undefined
		calendarAccessToken = response
	}

	return calendarAccessToken
}
