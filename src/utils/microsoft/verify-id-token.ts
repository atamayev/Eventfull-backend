import jwt from "jsonwebtoken"
import getKey from "./get-key-from-microsoft"

export default async function verifyIdToken(idToken: string): Promise<jwt.JwtPayload | undefined> {
	try {
		const decoded = await new Promise<jwt.JwtPayload>((resolve, reject) => {
			jwt.verify(idToken, getKey, (err, decoded1) => {
				if (err) reject(err)
				else resolve(decoded1 as jwt.JwtPayload)
			})
		})
		return decoded
	} catch (error) {
		console.error(error)
		return undefined
	}
}
