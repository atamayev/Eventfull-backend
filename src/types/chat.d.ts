import { Types } from "mongoose"

declare global {
	interface GroupChatWithName extends TimestampsInterface {
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
		replyTo: Types.ObjectId | null
		groupMessageId: Types.ObjectId
		isActive: boolean
		messageStatuses: MessageStatusObject[]
	}

	interface PrivateChatWithName extends TimestampsInterface {
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
		replyTo: Types.ObjectId | null
		privateMessageId: Types.ObjectId
		isActive: boolean
		messageStatus: MessageStatuses
	}

	type MessageStatuses = "Sent" | "Delivered" | "Read" | "Sender"

	interface MessageStatusObjectNoTimestamps extends SocialData {
		messageStatus: MessageStatuses
	}

	interface MessageStatusObject extends MessageStatusObjectNoTimestamps, TimestampsInterface {
	}
}

export {}
