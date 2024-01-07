import { Types } from "mongoose"

declare global {
	interface GroupChatWithNames extends TimestampsInterface {
		_id: Types.ObjectId
		chatName: string
		participants: Types.ObjectId[]
		isActive: boolean
		lastMessage: LastMessageRetrieveGroupChats | null
	}

	interface LastMessageRetrieveGroupChats extends TimestampsInterface {
		_id: Types.ObjectId
		text: string
		senderDetails: SocialData
		isTextEdited: boolean
		readBy: Types.ObjectId[]
		groupMessageId: Types.ObjectId
	}

	interface PrivateChatWithNames extends TimestampsInterface {
		_id: Types.ObjectId
		chatName: string
		participants: Types.ObjectId[]
		isActive: boolean
		lastMessage: LastMessageRetrievePrivateChats | null
	}

	interface LastMessageRetrievePrivateChats extends TimestampsInterface {
		_id: Types.ObjectId
		text: string
		senderDetails: SocialData
		isTextEdited: boolean
		readByOtherUser: boolean
		privateMessageId: Types.ObjectId
	}
}

export {}
