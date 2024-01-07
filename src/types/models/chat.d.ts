declare global {
	interface Chat extends IDInterface, TimestampsInterface {
		participants: Types.ObjectId[]
		isActive: boolean
	}

	interface PrivateChat extends Chat {
		lastMessage: PrivateMessage | null
	}

	interface GroupChat extends Chat {
		lastMessage: GroupMessage | null
	}

	interface Message extends IDInterface, TimestampsInterface {
		senderId: Types.ObjectId
		text: string
		isTextEdited: boolean
		replyTo: Types.ObjectId | null
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
		readByOtherUser: boolean
		privateChatId: Types.ObjectId
	}

	interface GroupMessageWithChatId extends Message {
		readBy: Types.ObjectId[]
		groupChatId: Types.ObjectId
	}
}

export {}
