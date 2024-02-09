import { Schema } from "mongoose"

const socialDataSchema = new Schema<SocialData>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true }
}, { _id: false })

export default socialDataSchema

export const socialDataWithTimestampSchema = new Schema<SocialDataWithTimestamp>({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
}, { _id: false })

export const adminData = new Schema<AdminSocialDataWithTimestamp>({
	adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
	username: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
}, { _id: false })
