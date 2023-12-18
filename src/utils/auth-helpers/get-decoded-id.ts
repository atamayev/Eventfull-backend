import jwt from "jsonwebtoken"
import { Types } from "mongoose"

export default function getDecodedId(accessToken: string): Types.ObjectId | undefined {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_KEY) as JwtPayload
		return new Types.ObjectId(decoded.userId)
	} catch (error) {
		console.error(error)
		return undefined
	}
}
