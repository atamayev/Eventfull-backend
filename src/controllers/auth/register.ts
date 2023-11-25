import _ from "lodash"
import { Response, Request } from "express"
import signJWT from "../../utils/auth-helpers/sign-jwt"
import addLoginHistory from "../../utils/auth-helpers/add-login-record"
import { addUser, hashPassword } from "../../utils/auth-helpers/register-helpers"
import { doesContactExist } from "../../utils/auth-helpers/find-one-user-from-contact"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"

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

		const userId = await addUser(req.body.registerInformationObject, contactType, hashedPassword)

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
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
