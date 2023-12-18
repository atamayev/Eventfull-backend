/* eslint-disable @typescript-eslint/no-namespace */
import { Types, Document } from "mongoose"

declare global {
	namespace Express {
		interface Request {
			userId: Types.ObjectId
			friendId: Types.ObjectId
			friendUsername: string

			blockedUserId: Types.ObjectId
			blockedUserUsername: string

			unblockedUserId: Types.ObjectId
			unblockedUserUsername: string

			contactType: EmailOrPhone

			organizerOrCoHost: "Organizer" | "Co-Host"
			isUserAttendingEvent: boolean

            event: EventfullEvent

			user: User

		}
	}
}

export {}
