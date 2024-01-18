import { Schema } from "mongoose"

export const messageStatusSchema = new Schema<MessageStatusObject>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	messageStatus: { type: String, enum: ["Sent", "Delivered", "Read"], default: "Sent" },
	username: { type: String, required: true }
}, { timestamps: true })
