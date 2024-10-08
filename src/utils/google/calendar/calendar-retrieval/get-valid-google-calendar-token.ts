import _ from "lodash"
import getGoogleCalendarTokens from "./get-google-calendar-tokens"
import refreshGoogleCalendarToken from "./refresh-google-calendar-token"

export default async function getValidGoogleCalendarAccessToken(user: User): Promise<string | undefined> {
	const tokens = getGoogleCalendarTokens(user)
	if ((_.isUndefined(tokens.calendarRefreshToken))) {
		return undefined
	}

	let { calendarAccessToken } = tokens
	const { calendarTokenExpiryDate, calendarRefreshToken } = tokens

	const currentTime = new Date()

	if (_.isUndefined(calendarTokenExpiryDate) || currentTime >= calendarTokenExpiryDate) {
		const response = await refreshGoogleCalendarToken(user._id, calendarRefreshToken)
		if (_.isNil(response)) return undefined
		calendarAccessToken = response
	}

	return calendarAccessToken
}
