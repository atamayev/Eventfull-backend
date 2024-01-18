import { Schema } from "mongoose"

export const socialDataSchema = new Schema<SocialData>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true }
})
