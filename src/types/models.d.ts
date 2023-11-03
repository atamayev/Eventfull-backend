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
		authMethod: string
		password?: string
		createdAt: Date
		updatedAt: Date
		firstName?: string
		lastName?: string
		gender?: string
		profilePictureURL?: string
		phoneNumber?: string
		bio?: string
		eventPins?: Types.ObjectId[]
		calendarData?: CalendarData[]
		googleLoginAccessToken?: string
		googleLoginRefreshToken?: string
		googleLoginAccessTokenExpiryDate?: Date
		googleCalendarAccessToken?: string
		googleCalendarAccessTokenExpiryDate?: Date
		loginHistory?: LoginHistory[]
		friends?: Types.ObjectId[]
		outgoingFriendRequests?: Types.ObjectId[]
		incomingFriendRequests?: Types.ObjectId[]
		blockedUsers?: Types.ObjectId[]
		blockedByUsers?: Types.ObjectId[]
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

	interface LoginHistory {
		loginTime: Date
		// ipAddress: string
		// device: string
	}

	interface Event extends IDInterface {
		eventName: string
		eventTimeStart: Date
		eventTimeEnd: Date
		eventPrice: number
		eventType: string
		eventURL: string
		isVirtual: boolean
		// Categories should be of type eventCategory[]
		extraEventCategories?: string[]
		eventDescription?: string
		eventLocation?: {
			longitude: string
			latitude: string
			address: string
		}
		organizerName?: string
		eventImageURL?: string
		eventCapacity?: number
	}

	interface Booking extends IDInterface {
		userId: number
		eventId: number
		reviewRating?: number
		reviewMessage?: string
	}
}

export {}
