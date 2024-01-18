import { Document, Types } from "mongoose"

declare global {
	interface UserWithFriendStatus extends Document {
		userId: Types.ObjectId | string
		username: string
	}
}

export {}
