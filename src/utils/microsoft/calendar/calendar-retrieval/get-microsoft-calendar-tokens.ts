export default function getMicrosoftCalendarTokens(user: User):
	{
		calendarAccessToken: string | undefined,
		calendarRefreshToken: string | undefined,
		calendarTokenExpiryDate: Date | undefined
	}
{
	return {
		calendarAccessToken: user.microsoftCalendarAccessToken,
		calendarRefreshToken: user.microsoftCalendarRefreshToken,
		calendarTokenExpiryDate: user.microsoftCalendarAccessTokenExpiryDate
	}
}
