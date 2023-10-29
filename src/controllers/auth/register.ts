import _ from "lodash"
import { Response, Request } from "express"
import { addUser, doesEmailExist, hashPassword, signJWT } from "../../utils/auth-helpers"

export default async function register (req: Request, res: Response): Promise<Response> {
	const { email, password } = req.body.registerInformationObject as LoginInformationObject

	const exists = await doesEmailExist(email)
	if (exists === true) return res.status(400).json({ message: "Email already exists" })

	const { hashedPassword, hashError } = await hashPassword(password)
	if (!_.isUndefined(hashError)) return res.status(500).json({ error: hashError })

	const userId = await addUser(email, hashedPassword)

	const payload: JwtPayload = {
		userId: userId,
		newUser: true
	}

	const token = signJWT(payload)
	if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

	return res
		.status(200)
		.json({ authenticated: true, accessToken: token })
}
