import { Schema, model } from "mongoose"
import { socialDataSchema } from "../sender-details-model"

const privateMessageSchema = new Schema<PrivateMessageWithChatId>({
	privateChatId: { type: Schema.Types.ObjectId, ref: "PrivateChat", required: true },
	senderDetails: socialDataSchema,
	text: { type: String, trim: true, required: true },
	isTextEdited: { type: Boolean, default: false},
	replyTo: { type: Schema.Types.ObjectId, ref: "PrivateMessage", default: null },
	isActive: { type: Boolean, default: true },
	messageStatus: { type: String, enum: ["Sent", "Delivered", "Read"], default: "Sent" },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const PrivateMessageModel = model("PrivateMessage", privateMessageSchema, "private-messages")

export default PrivateMessageModel
