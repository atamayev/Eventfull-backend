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

	interface GroupMessageChat extends Chat {
		lastMessage: GroupMessage | null
	}

	interface Message extends IDInterface {
		senderId: Types.ObjectId
		text: string
		isTextEdited: boolean
		createdAt: Date
		updatedAt: Date
	}

	interface DirectMessage extends Message {
		readByOtherUser: boolean
		messageId: Types.ObjectId
	}

	interface GroupMessage extends Message {
		readBy: Types.ObjectId[]
		messageId: Types.ObjectId
	}

	interface DirectMessageWithChatId extends Message {
		chatId: Types.ObjectId
		readByOtherUser: boolean
	}

	interface GroupMessageWithChatId extends Message {
		chatId: Types.ObjectId
		readBy: Types.ObjectId[]
	}
}

export {}
