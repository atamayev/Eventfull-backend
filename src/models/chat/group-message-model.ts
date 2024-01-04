import { Schema, model } from "mongoose"

const groupMessageSchema = new Schema<GroupMessageWithChatId>({
	chatId: { type: Schema.Types.ObjectId, ref: "GroupMessageChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
	readBy: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], required: true }
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageModel = model("GroupMessage", groupMessageSchema, "group-messages")

export default GroupMessageModel
