import { Types } from "mongoose"

declare global {
	interface EventCategory extends IDInterface {
		eventCategory: string
		description: string
	}

	interface EventType extends IDInterface {
		name: string
		description: string
		// Categories should be of type eventCategory[]
		categories: string[]
	}

	interface User extends IDInterface {
		email: string
		password: string
		createdAt: string
		updatedAt: string
		name?: string
		gender?: string
		profilePictureURL?: string
		phoneNumber?: string
		bio?: string
		eventPins?: Types.ObjectId[]
		calendarData?: CalendarData[]
	}

	interface CalendarData {
		eventName: string
		start: {
			dateTime: string
			timeZone: string
		}
		end: {
			dateTime: string
			timeZone: string
		}
	}
}

export {}
