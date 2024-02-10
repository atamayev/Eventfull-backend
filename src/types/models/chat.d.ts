import { Types } from "mongoose"

declare global {
	interface Chat extends IDInterface, TimestampsInterface {
		participantDetails: SocialData[]
		isActive: boolean
	}

	interface PrivateChat extends Chat {
		lastMessage: PrivateMessage | null
	}

	interface GroupChat extends Chat {
		lastMessage: GroupMessage | null
	}

	interface Message extends IDInterface, TimestampsInterface {
		senderDetails: SocialData
		text: string
		isTextEdited: boolean
		// ReplyTo is the id of the message to which this message is a reply to
		replyTo: Types.ObjectId | null
		isActive: boolean
		// TODO: Add sentAt, deliveredAt fields
	}

	// The following two interfaces are used in the Chat Models
	interface PrivateMessage extends Message {
		privateMessageId: Types.ObjectId
		messageStatus: MessageStatuses
	}

	interface GroupMessage extends Message {
		messageStatuses: MessageStatusObject[]
		groupMessageId: Types.ObjectId
	}

	// The following two interfaces are used in the Messages Models
	interface PrivateMessageWithChatId extends Message {
		privateChatId: Types.ObjectId
		messageStatus: MessageStatuses
	}

	interface GroupMessageWithChatId extends Message {
		messageStatuses: MessageStatusObject[]
		groupChatId: Types.ObjectId
	}
}

export {}
