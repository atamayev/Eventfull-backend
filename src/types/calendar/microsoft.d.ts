declare global {
	//Delete this file after importing Microsoft's official types

	// Initial Calendar resposne (before specifying the calendar ID)
	interface MSCalendarOwner {
		name: string
		address: string
	}

	interface MSCalendar {
		id: string
		name: string
		color: string
		hexColor: string
		isDefaultCalendar: boolean
		changeKey: string
		canShare: boolean
		canViewPrivateItems: boolean
		canEdit: boolean
		allowedOnlineMeetingProviders: string[]
		defaultOnlineMeetingProvider: string
		isTallyingResponses: boolean
		isRemovable: boolean
		owner: CalendarOwner
	}

	interface MSCalendarResponse {
		value: MSCalendar[]
	}
}

export {}
