import { Types } from "mongoose"

declare global {
	namespace Express {
		interface Request {
			userId: Types.ObjectId
			user: User

			friendId: Types.ObjectId
			friend: User

			blockedUserId: Types.ObjectId
			blockedUser: User

			unblockedUserId: Types.ObjectId
			unblockedUser: User

			contactType: EmailOrPhone

			organizerOrCoHost: "Organizer" | "Co-Host"
			isUserAttendingEvent: boolean

			event: EventfullEvent
			eventOrganizer: User
		}
	}
}

export {}
