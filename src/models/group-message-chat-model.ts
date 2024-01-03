import { Schema, model, Types } from "mongoose"

const groupMessageChatSchema = new Schema<Chat>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true,
		validate: [arrayLimit, "{PATH} exceeds the limit of 2"]
	},
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
	lastMessage: {
		messageId: { type: Schema.Types.ObjectId, ref: "Message" },
		text: { type: String, trim: true },
		sender: { type: Schema.Types.ObjectId, ref: "User" },
		createdAt: { type: Date, required: true },
	},
})

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	// Ensure the array has more than 2 participants
	return val ? val.length > 2 : false
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageChatModel = model("GroupMessageChat", groupMessageChatSchema, "group-message-chats")

export default GroupMessageChatModel
