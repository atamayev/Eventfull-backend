import { Types } from "mongoose"

declare global {
	interface SocialData {
		userId: Types.ObjectId
		username: string
	}

	interface SocialDataWithTimestamp extends SocialData {
		createdAt: Date
	}

	interface AdminSocialData {
		adminId: Types.ObjectId
		username: string
	}
}

export {}
