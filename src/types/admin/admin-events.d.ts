import { Types } from "mongoose"

declare global {
	// TODO: Incorporate event frequency into the eventfullevent schema.
	// same for day of week, datetimes, and ongoing events
	type EventFrequency = "one-time" | "repeated" | "regularly-repeated" | "ongoing"

	type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

	interface DateTimes {
		startDateTime: Date
		endDateTime: Date
	}

	interface OngoingEvents {
		dayOfWeek: DayOfWeek
		startTime: string
		endTime: string
	}

	interface NewAdminEventfullEvent {
		eventName: string
		eventFrequency: EventFrequency | ""
		address: string
		eventDuration: {
			hours: number
			minutes: number
		}
		eventDescription: string
		addedBy: Types.ObjectId
		eventPrice: number

		eventURL?: string

		// For ongoing events:
		ongoingEventTimes?: OngoingEvents[]

		// For repeated events:
		dates?: DateTimes[]
		// For one time events:
		eventTime?: Date | null
	}
}

export {}
