import { Types } from "mongoose"

declare global {
	interface UserWithFriendStatus {
		_id?: Types.ObjectId
		userId: Types.ObjectId | string
		username: string
	}
}

export {}
