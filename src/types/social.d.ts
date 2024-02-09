import { Types } from "mongoose"

declare global {
	interface SocialData {
		userId: Types.ObjectId
		username: string
	}

	interface SocialDataWithTimestamp extends SocialData {
		createdAt: Date
	}

	interface AdminSocialDataWithTimestamp {
		adminId: Types.ObjectId
		username: string
		createdAt: Date
	}
}

export {}
