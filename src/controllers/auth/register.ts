import _ from "lodash"
import { Response, Request } from "express"
import signJWT from "../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"
import doesContactExist from "../../utils/auth-helpers/does-contact-exist"
import { addLocalUser, hashPassword } from "../../utils/auth-helpers/register-helpers"
import createJWTPayload from "../../utils/auth-helpers/create-jwt-payload"

export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, username, password } = req.body.registerInformationObject as RegisterInformationObject
		const contactType = req.contactType

		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) return res.status(400).json({ message: `${contactType} already exists` })

		const { hashedPassword, hashError } = await hashPassword(password)
		if (!_.isUndefined(hashError)) return res.status(500).json({ error: hashError })

		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const userId = await addLocalUser(req.body.registerInformationObject, contactType, hashedPassword)

		const payload = createJWTPayload(userId, true)

		const token = signJWT(payload)
		if (_.isUndefined(token)) return res.status(500).json({ error: "Problem with Signing JWT" })

		await addLoginHistory(userId)

		return res
			.status(200)
			.json({ authenticated: true, accessToken: token })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
