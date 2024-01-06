import { Schema, model, Types } from "mongoose"

const lastMessageSchema = new Schema<PrivateMessage>({
	text: { type: String, trim: true },
	senderId: { type: Schema.Types.ObjectId, ref: "User" },
	isTextEdited: { type: Boolean, default: false },
	readByOtherUser: { type: Boolean, default: false },
	privateMessageId: { type: Schema.Types.ObjectId, ref: "PrivateMessage" }
}, { timestamps: true })

const privateChatSchema = new Schema<PrivateChat>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
		required: true,
		validate: [arrayLimit, "{PATH} exceeds the limit of 2"]
	},
	isActive: { type: Boolean, default: true },
	lastMessage: lastMessageSchema,
}, { timestamps: true })

function arrayLimit(val: Types.ObjectId[] | null | undefined): boolean {
	return val ? val.length <= 2 : true
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const PrivateChatModel = model("PrivateChat", privateChatSchema, "private-chats")

export default PrivateChatModel
