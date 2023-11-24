import jwt from "jsonwebtoken"

export default function signJWT(payload: object): string | undefined {
	try {
		return jwt.sign(payload, process.env.JWT_KEY)
	} catch (error) {
		console.error(error)
		return undefined
	}
}
