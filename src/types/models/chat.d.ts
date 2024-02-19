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

	interface Message extends TimestampsInterface {
		senderDetails: SocialData
		text: string
		isTextEdited: boolean
		// ReplyTo is the id of the message to which this message is a reply to
		replyTo: Types.ObjectId | null
		isActive: boolean
		// TODO: Add sentAt, deliveredAt fields
	}

	// The following two interfaces are used in the Chat Models
	interface PrivateMessage extends IDInterface, Message {
		privateMessageId: Types.ObjectId
		messageStatus: MessageStatuses
	}

	interface GroupMessage extends IDInterface, Message {
		groupMessageId: Types.ObjectId
		messageStatuses: MessageStatusObject[]
	}

	// Same as Private Mesasge, but without the _id
	interface LastPrivateMessage extends Message {
		privateMessageId: Types.ObjectId
		messageStatus: MessageStatuses
	}

	// Same as Group Mesasge, but without the _id
	interface LastGroupMessage extends Message {
		groupMessageId: Types.ObjectId
		messageStatuses: MessageStatusObject[]
	}

	// The following two interfaces are used in the Messages Models
	interface PrivateMessageWithChatId extends IDInterface, Message {
		privateChatId: Types.ObjectId
		messageStatus: MessageStatuses
	}

	interface GroupMessageWithChatId extends IDInterface, Message {
		messageStatuses: MessageStatusObject[]
		groupChatId: Types.ObjectId
	}
}

export {}
