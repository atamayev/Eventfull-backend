import { Schema, model, Types } from "mongoose"
import socialDataSchema from "../social-data-model"
import { messageStatusSchema } from "../message-status-model"

const lastMessageSchema = new Schema<GroupMessage>({
	text: { type: String, trim: true },
	senderDetails: socialDataSchema,
	isTextEdited: { type: Boolean, default: false },
	messageStatuses: [messageStatusSchema],
	groupMessageId: { type: Schema.Types.ObjectId, ref: "GroupMessage" },
	replyTo: { type: Schema.Types.ObjectId, ref: "GroupMessage", default: null },
	isActive: { type: Boolean, default: true },
}, { timestamps: true })

const groupChatSchema = new Schema<GroupChat>({
	participantDetails: {
		type: [socialDataSchema],
		required: true,
		validate: [arrayLimit, "{PATH} requires at least 3 participants"]
	},
	isActive: { type: Boolean, default: true },
	lastMessage: lastMessageSchema,
}, { timestamps: true })

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	return val ? val.length > 2 : false
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const GroupChatModel = model("GroupChat", groupChatSchema, "group-chats")

export default GroupChatModel
