import { Schema, model } from "mongoose"
import { socialDataSchema } from "../sender-details-model"

const groupMessageSchema = new Schema<GroupMessageWithChatId>({
	groupChatId: { type: Schema.Types.ObjectId, ref: "GroupChat", required: true },
	senderDetails: socialDataSchema,
	text: { type: String, trim: true, required: true },
	readBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], required: true },
	isTextEdited: { type: Boolean, default: false},
	replyTo: { type: Schema.Types.ObjectId, ref: "GroupMessage", default: null },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageModel = model("GroupMessage", groupMessageSchema, "group-messages")

export default GroupMessageModel
