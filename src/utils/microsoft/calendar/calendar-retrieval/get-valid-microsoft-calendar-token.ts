import _ from "lodash"
import getMicrosoftCalendarTokens from "./get-microsoft-calendar-tokens"
import refreshMicrosoftCalendarToken from "./refresh-microsoft-calendar-token"

export default async function getValidMicrosoftCalendarAccessToken(user: User): Promise<string | undefined> {
	const tokens = getMicrosoftCalendarTokens(user)
	if ((_.isUndefined(tokens.calendarRefreshToken))) {
		return undefined
	}

	let { calendarAccessToken } = tokens
	const { calendarTokenExpiryDate, calendarRefreshToken } = tokens

	const currentTime = new Date()

	if (_.isUndefined(calendarTokenExpiryDate) || currentTime >= calendarTokenExpiryDate) {
		const response = await refreshMicrosoftCalendarToken(user._id, calendarRefreshToken)
		if (_.isNull(response)) return undefined
		calendarAccessToken = response
	}

	return calendarAccessToken
}
