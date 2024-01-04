import { Schema, model } from "mongoose"

const groupMessagesSchema = new Schema<MessageWithChatId>({
	chatId: { type: Schema.Types.ObjectId, ref: "GroupMessageChat", required: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	text: { type: String, trim: true, required: true },
}, { timestamps: true })

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupMessageModel = model("GroupMessage", groupMessagesSchema, "group-messages")

export default GroupMessageModel
