import { Schema, model, Types } from "mongoose"

const lastMessageSchema = new Schema<GroupMessage>({
	text: { type: String, trim: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User" },
	isTextEdited: { type: Boolean, default: false },
	readBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
}, { timestamps: true })

const groupMessageChatSchema = new Schema<Chat>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true,
		validate: [arrayLimit, "{PATH} exceeds the limit of 2"]
	},
	isActive: { type: Boolean, default: true },
	lastMessage: lastMessageSchema,
}, { timestamps: true })

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	// Ensure the array has more than 2 participants
	return val ? val.length > 2 : false
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageChatModel = model("GroupMessageChat", groupMessageChatSchema, "group-message-chats")

export default GroupMessageChatModel
