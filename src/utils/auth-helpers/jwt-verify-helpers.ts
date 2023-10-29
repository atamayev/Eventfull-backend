import jwt from "jsonwebtoken"
import { UserModel } from "../../models/user-model"

export async function doesUserIdExist(userId: string): Promise<boolean> {
	const user = await UserModel.findById(userId)
	return user !== null
}

export function getDecodedId(accessToken: string): string | undefined {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_KEY) as JwtPayload
		return decoded.userId
	} catch (error: unknown) {
		return undefined
	}
}
