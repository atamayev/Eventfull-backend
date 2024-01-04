import { Schema, model, Types } from "mongoose"

const lastMessageSchema = new Schema({
	messageId: { type: Schema.Types.ObjectId, ref: "Message" },
	text: { type: String, trim: true },
	sender: { type: Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, required: true },
})

const directMessageChatSchema = new Schema<Chat>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true,
		validate: [arrayLimit, "{PATH} exceeds the limit of 2"]
	},
	createdAt: { type: Date, required: true },
	updatedAt: { type: Date, required: true },
	lastMessage: lastMessageSchema,
})

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	return val ? val.length <= 2 : true
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const DirectMessageChatModel = model("DirectMessageChat", directMessageChatSchema, "direct-message-chats")

export default DirectMessageChatModel
