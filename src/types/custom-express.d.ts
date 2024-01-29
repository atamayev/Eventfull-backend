declare global {
	namespace Express {
		interface Request {
			user: User
			admin: Admin

			privateChat: PrivateChat
			privateMessage: PrivateMessageWithChatId

			groupChat: GroupChat
			groupMessage: GroupMessageWithChatId

			friend: User
			friends: User[]

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
