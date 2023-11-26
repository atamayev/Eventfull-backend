import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../setup-and-security/hash"
import signJWT from "../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"
import retrieveUserIdAndPassword from "../../utils/auth-helpers/retrieve-user-id-and-password"
import createJWTPayload from "../../utils/auth-helpers/create-jwt-payload"

export default async function login (req: Request, res: Response): Promise<Response> {
	const { contact, password } = req.body.loginInformationObject as LoginInformationObject
	const contactType = req.contactType

	let results: UserIdAndPassword

	try {
		const results1 = await retrieveUserIdAndPassword(contact, contactType)
		if (_.isUndefined(results1) || _.isEmpty(results1)) {
			return res.status(404).json({ error: "Username not found!" })
		}
		if (results1.source === "google") {
			return res.status(400).json({ error: "Username exists, but you must login via Google" })
		} else if (results1.source === "microsoft") {
			return res.status(400).json({ error: "Username exists, but you must login via Microsoft" })
		}
		else results = results1
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Problem with email selection" })
	}

	try {
		const bool = await Hash.checkPassword(password, results.password)
		if (bool === false) return res.status(400).json({ error: "Wrong Username or Password!" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Problem with checking password" })
	}

	const payload = createJWTPayload(results.userId)

	const token = signJWT(payload)
	if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

	await addLoginHistory(results.userId)

	return res
		.status(200)
		.json({ authenticated: true, accessToken: token })
}
