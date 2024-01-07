import { Types } from "mongoose"

declare global {
	interface SocialData {
		_id: Types.ObjectId
		username: string
	}
}

export {}
