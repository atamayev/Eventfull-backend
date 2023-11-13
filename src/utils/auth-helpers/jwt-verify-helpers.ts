import jwt from "jsonwebtoken"
import UserModel from "../../models/user-model"
import { Types } from "mongoose"

export async function doesUserIdExist(userId: Types.ObjectId): Promise<boolean> {
	const user = await UserModel.findById(userId)
	return user !== null
}

export function getDecodedId(accessToken: string): Types.ObjectId | undefined {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_KEY) as JwtPayload
		return new Types.ObjectId(decoded.userId)
	} catch (error) {
		console.error(error)
		return undefined
	}
}
