import { Schema, model, Types } from "mongoose"

const lastMessageSchema = new Schema<Message>({
	text: { type: String, trim: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

const directMessageChatSchema = new Schema<Chat>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true,
		validate: [arrayLimit, "{PATH} exceeds the limit of 2"]
	},
	isActive: { type: Boolean, default: true },
	lastMessage: lastMessageSchema,
}, {
	timestamps: true
})

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	return val ? val.length <= 2 : true
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const DirectMessageChatModel = model("DirectMessageChat", directMessageChatSchema, "direct-message-chats")

export default DirectMessageChatModel
