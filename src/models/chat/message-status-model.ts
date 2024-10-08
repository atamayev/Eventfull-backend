import { Schema } from "mongoose"

export const messageStatusSchema = new Schema<MessageStatusObject>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true },
	messageStatus: { type: String, enum: ["Sent", "Delivered", "Read", "Sender"], required: true }
}, { _id: false, timestamps: true })
