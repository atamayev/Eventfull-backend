import { Schema, model } from "mongoose"

const directMessageSchema = new Schema<DirectMessageWithChatId>({
	chatId: { type: Schema.Types.ObjectId, ref: "DirectMessageChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
	readByOtherUser: { type: Boolean, default: false },
	isTextEdited: { type: Boolean, default: false}
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const DirectMessageModel = model("DirectMessage", directMessageSchema, "direct-messages")

export default DirectMessageModel
