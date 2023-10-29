import { Document, Types } from "mongoose"

declare global {
	interface IDInterface extends Document {
		_id: Types.ObjectId
	}

	interface JwtPayload {
		userId: string
		newUser?: boolean
	}
}

export {}
