import { Types } from "mongoose"

declare global {
	interface SocialData {
		userId: Types.ObjectId
		username: string
	}
}

export {}
