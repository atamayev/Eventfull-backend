import { Types } from "mongoose"

declare global {
	interface GroupChatWithNames {
		_id: Types.ObjectId
		chatName: string
		participants: Types.ObjectId[]
		isActive: boolean
		createdAt: Date
		updatedAt: Date
		lastMessage: LastMessageRetrieveGroupChats | null
	}

	interface LastMessageRetrieveGroupChats {
		text: string
		_id: Types.ObjectId
		senderId: Types.ObjectId
		isTextEdited: boolean
		readBy: Types.ObjectId[]
		groupMessageId: Types.ObjectId
		createdAt: Date
		updatedAt: Date
	}

	interface PrivateChatWithNames {
		_id: Types.ObjectId
		chatName: string
		participants: Types.ObjectId[]
		isActive: boolean
		createdAt: Date
		updatedAt: Date
		lastMessage: LastMessageRetrievePrivateChats | null
	}

	interface LastMessageRetrievePrivateChats {
		text: string
		_id: Types.ObjectId
		senderId: Types.ObjectId
		isTextEdited: boolean
		readByOtherUser: boolean
		privateMessageId: Types.ObjectId
		createdAt: Date
		updatedAt: Date
	}
}

export {}
