import _ from "lodash"
import { Response, Request } from "express"
import { signJWT } from "../../utils/auth-helpers/common-auth-helpers"
import { addUser, doesEmailExist, hashPassword } from "../../utils/auth-helpers/register-helpers"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"

export default async function register (req: Request, res: Response): Promise<Response> {
	const { email, password } = req.body.registerInformationObject as LoginInformationObject

	const exists = await doesEmailExist(email)
	if (exists === true) return res.status(400).json({ message: "Email already exists" })

	const { hashedPassword, hashError } = await hashPassword(password)
	if (!_.isUndefined(hashError)) return res.status(500).json({ error: hashError })

	const userId = await addUser(email, hashedPassword)

	const payload: JwtPayload = {
		userId: _.toString(userId),
		newUser: true
	}

	const token = signJWT(payload)
	if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

	await addLoginHistory(userId)

	return res
		.status(200)
		.json({ authenticated: true, accessToken: token })
}
