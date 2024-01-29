import _ from "lodash"
import { Response, Request } from "express"
import doesAdminEmailExist from "../../../utils/auth-helpers/does-admin-email-exist"
import { hashPassword } from "../../../utils/auth-helpers/register/register-helpers"
import addLoginRecord from "../../../utils/auth-helpers/add-login-record"
import addAdmin from "../../../utils/auth-helpers/register/add-admin"
import doesUsernameExist from "../../../utils/auth-helpers/does-username-exist"
import createAndSignAdminJWT from "../../../utils/auth-helpers/jwt/create-and-sign-admin-jwt"

export default async function adminRegister(req: Request, res: Response): Promise<Response> {
	try {
		const { email, username, password } = req.body.registerInformation as AdminRegisterInformation

		const emailExists = await doesAdminEmailExist(email)
		if (emailExists === true) return res.status(400).json({ message: "Email Already Registered. Try Logging in." })

		const { hashedPassword, hashError } = await hashPassword(password)
		if (!_.isUndefined(hashError)) return res.status(500).json({ error: "Internal Server Error: Unable to Hash Password" })

		const usernameExists = await doesUsernameExist(username, true)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const adminId = await addAdmin(req.body.registerInformation, hashedPassword)

		const accessToken = createAndSignAdminJWT(adminId)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginRecord(adminId, true)

		return res.status(200).json({ accessToken })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
