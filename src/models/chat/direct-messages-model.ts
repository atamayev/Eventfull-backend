import { Schema, model } from "mongoose"

const directMessagesSchema = new Schema<MessageWithChatId>({
	chatId: { type: Schema.Types.ObjectId, ref: "DirectMessageChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const DirectMessageModel = model("DirectMessage", directMessagesSchema, "direct-messages")

export default DirectMessageModel
