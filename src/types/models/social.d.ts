declare global {
	interface Chat extends IDInterface {
		participants: Types.ObjectId[]
		createdAt: Date
		updatedAt: Date
		isActive: boolean
	}

	interface PrivateChat extends Chat {
		lastMessage: PrivateMessage | null
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
		// TODO: Consider adding sentAt, deliveredAt fields
	}

	// The following two interfaces are used in the Chat Models
	interface PrivateMessage extends Message {
		readByOtherUser: boolean
		privateMessageId: Types.ObjectId
	}

	interface GroupMessage extends Message {
		readBy: Types.ObjectId[]
		groupMessageId: Types.ObjectId
	}

	// The following two interfaces are used in the Messages Models
	interface PrivateMessageWithChatId extends Message {
		privateChatId: Types.ObjectId
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
