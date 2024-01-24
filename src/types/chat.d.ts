import { Types } from "mongoose"

declare global {
	interface GroupChatWithNames extends TimestampsInterface {
		_id: Types.ObjectId
		chatName: string
		participantDetails: SocialData[]
		isActive: boolean
		lastMessage: LastMessageRetrieveGroupChats | null
	}

	interface LastMessageRetrieveGroupChats extends TimestampsInterface {
		_id: Types.ObjectId
		text: string
		senderDetails: SocialData
		isTextEdited: boolean
		messageStatuses: MessageStatusObject[]
		groupMessageId: Types.ObjectId
		replyTo: Types.ObjectId | null
	}

	interface PrivateChatWithNames extends TimestampsInterface {
		_id: Types.ObjectId
		chatName: string
		participantDetails: SocialData[]
		isActive: boolean
		lastMessage: LastMessageRetrievePrivateChats | null
	}

	interface LastMessageRetrievePrivateChats extends TimestampsInterface {
		_id: Types.ObjectId
		text: string
		senderDetails: SocialData
		isTextEdited: boolean
		privateMessageId: Types.ObjectId
		replyTo: Types.ObjectId | null
	}

	type MessageStatuses = "Sent" | "Delivered" | "Read" | "Sender"

	interface MessageStatusObjectNoTimestamps {
		userId: Types.ObjectId
		messageStatus: MessageStatuses
		username: string
	}

	interface MessageStatusObject extends MessageStatusObjectNoTimestamps, TimestampsInterface {
	}
}

export {}
