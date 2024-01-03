import { Schema, model } from "mongoose"

const messagesSchema = new Schema<Message>({
	chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
	createdAt: { type: Date, required: true },
	readBy: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true
	},
})

// eslint-disable-next-line @typescript-eslint/naming-convention
const MessageModel = model("Message", messagesSchema, "messages")

export default MessageModel
