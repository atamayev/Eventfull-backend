import { Schema } from "mongoose"

const socialDataSchema = new Schema<SocialData>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true }
}, { _id: false })

export default socialDataSchema
