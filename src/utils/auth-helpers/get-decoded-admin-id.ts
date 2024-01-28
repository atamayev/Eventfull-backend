import jwt from "jsonwebtoken"
import { Types } from "mongoose"

export default function getDecodedAdminId(accessToken: string): Types.ObjectId | undefined {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_KEY) as AdminJwtPayload
		return new Types.ObjectId(decoded.adminId)
	} catch (error) {
		console.error(error)
		return undefined
	}
}
