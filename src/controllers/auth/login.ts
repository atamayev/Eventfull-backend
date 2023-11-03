import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../setup-and-security/hash"
import { signJWT, retrieveUserIdAndPassword } from "../../utils/auth-helpers/login-helpers"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"

export default async function login (req: Request, res: Response): Promise<Response> {
	const { email, password } = req.body.loginInformationObject as LoginInformationObject

	let results: UserIdAndPassword

	try {
		const results1 = await retrieveUserIdAndPassword(email)
		if (_.isUndefined(results1) || _.isEmpty(results1)) {
			return res.status(404).json({ error: "Username not found!" })
		}
		else results = results1
	} catch (error: unknown) {
		return res.status(500).json({ error: "Problem with email selection" })
	}

	try {
		const bool = await Hash.checkPassword(password, results.password)
		if (bool === false) return res.status(400).json({ error: "Wrong Username or Password!" })
	} catch (error: unknown) {
		return res.status(500).json({ error: "Problem with checking password" })
	}

	const payload: JwtPayload = {
		userId: results.userId,
		newUser: false
	}

	const token = signJWT(payload)
	if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

	await addLoginHistory(results.userId)

	return res
		.status(200)
		.json({ authenticated: true, accessToken: token })
}
