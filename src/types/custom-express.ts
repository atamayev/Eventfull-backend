/* eslint-disable @typescript-eslint/no-namespace */
import { Types } from "mongoose"

declare global {
	namespace Express {
		interface Request {
			userId: Types.ObjectId
			friendId: Types.ObjectId
			blockedUserId: Types.ObjectId
			unblockedUserId: Types.ObjectId
			contactType: EmailOrPhone
		}
	}
}

export {}
