import { Schema, model } from "mongoose"

const privateMessageSchema = new Schema<PrivateMessageWithChatId>({
	privateChatId: { type: Schema.Types.ObjectId, ref: "PrivateChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
	readByOtherUser: { type: Boolean, default: false },
	isTextEdited: { type: Boolean, default: false},
	replyTo: { type: Schema.Types.ObjectId, ref: "PrivateMessage", default: null },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const PrivateMessageModel = model("PrivateMessage", privateMessageSchema, "private-messages")

export default PrivateMessageModel
