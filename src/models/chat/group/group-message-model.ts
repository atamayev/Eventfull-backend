import { Schema, model } from "mongoose"

const groupMessageSchema = new Schema<GroupMessageWithChatId>({
	groupChatId: { type: Schema.Types.ObjectId, ref: "GroupChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
	readBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], required: true },
	isTextEdited: { type: Boolean, default: false},
	replyTo: { type: Schema.Types.ObjectId, ref: "GroupMessage", default: null },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageModel = model("GroupMessage", groupMessageSchema, "group-messages")

export default GroupMessageModel
