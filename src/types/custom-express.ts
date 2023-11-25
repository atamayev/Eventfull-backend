/* eslint-disable @typescript-eslint/no-namespace */
import { Types } from "mongoose"

declare global {
	namespace Express {
		interface Request {
			userId: Types.ObjectId
			contactType: EmailOrPhone
		}
	}
}

export {}
