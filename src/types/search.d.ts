import { Document, Types } from "mongoose"

declare global {
	interface UserWithFriendStatus extends Document {
		_id: Types.ObjectId | string
		username: string
		isFriend: boolean
		hasIncomingFriendRequest: boolean
		hasOutgoingFriendRequest: boolean
	}
}

export {}
