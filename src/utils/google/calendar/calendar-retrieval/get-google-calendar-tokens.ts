export default function getGoogleCalendarTokens(user: User):
	{
		calendarAccessToken: string | undefined,
		calendarRefreshToken: string | undefined,
		calendarTokenExpiryDate: Date | undefined
	}
{
	return {
		calendarAccessToken: user.googleCalendarAccessToken,
		calendarRefreshToken: user.googleCalendarRefreshToken,
		calendarTokenExpiryDate: user.googleCalendarAccessTokenExpiryDate
	}
}
