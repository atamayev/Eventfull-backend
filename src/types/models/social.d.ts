declare global {
	interface Chat extends IDInterface {
		participants: Types.ObjectId[]
		createdAt: Date
		updatedAt: Date
		isActive: boolean
	}

	interface DirectMessageChat extends Chat {
		lastMessage: DirectMessage | null
	}

	interface GroupChat extends Chat {
		lastMessage: GroupMessage | null
	}

	interface Message extends IDInterface {
		senderId: Types.ObjectId
		text: string
		isTextEdited: boolean
		createdAt: Date
		updatedAt: Date
	}

	// The following two interfaces are used in the Chat Models
	interface DirectMessage extends Message {
		readByOtherUser: boolean
		directMessageId: Types.ObjectId
	}

	interface GroupMessage extends Message {
		readBy: Types.ObjectId[]
		groupMessageId: Types.ObjectId
	}

	// The following two interfaces are used in the Messages Models
	interface DirectMessageWithChatId extends Message {
		directMessageChatId: Types.ObjectId
		readByOtherUser: boolean
		replyTo?: Types.ObjectId | null
	}

	interface GroupMessageWithChatId extends Message {
		groupChatId: Types.ObjectId
		readBy: Types.ObjectId[]
		replyTo?: Types.ObjectId | null
	}
}

export {}
