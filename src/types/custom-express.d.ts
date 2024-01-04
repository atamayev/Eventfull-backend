declare global {
	namespace Express {
		interface Request {
			user: User

			directMessageChat: DirectMessageChat
			directMessage: DirectMessageWithChatId

			friend: User

			blockedUser: User

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
