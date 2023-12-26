import { Document, Types } from "mongoose"

declare global {
	interface UserWithFriendStatus extends Document {
		_id: Types.ObjectId | string
		username: string
	}
}

export {}
