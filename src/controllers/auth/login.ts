import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../setup-and-security/hash"
import signJWT from "../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"
import retrieveUserIdAndPassword from "../../utils/auth-helpers/retrieve-user-id-and-password"
import createJWTPayload from "../../utils/auth-helpers/create-jwt-payload"
import determineLoginType from "../../utils/auth-helpers/determine-login-type"

export default async function login (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password } = req.body.loginInformationObject as LoginInformationObject
		const contactType = determineLoginType(contact)

		let results: UserIdAndPassword

		const results1 = await retrieveUserIdAndPassword(contact, contactType)
		if (_.isUndefined(results1) || _.isEmpty(results1)) {
			return res.status(404).json({ error: `${contactType} not found!` })
		}
		if (results1.source === "google") {
			return res.status(400).json({ error: "Username exists, but you must login via Google" })
		} else if (results1.source === "microsoft") {
			return res.status(400).json({ error: "Username exists, but you must login via Microsoft" })
		}
		else results = results1

		const doPasswordsMatch = await Hash.checkPassword(password, results.password)
		if (doPasswordsMatch === false) return res.status(400).json({ error: "Wrong Username or Password!" })

		const payload = createJWTPayload(results.userId)

		const token = signJWT(payload)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

		await addLoginHistory(results.userId)

		return res
			.status(200)
			.json({ authenticated: true, accessToken: token })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Problem with login" })
	}
}
