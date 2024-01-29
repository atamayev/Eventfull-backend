import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../../classes/hash"
import addLoginRecord from "../../../utils/auth-helpers/add-login-record"
import createAndSignAdminJWT from "../../../utils/auth-helpers/jwt/create-and-sign-admin-jwt"
import determineAdminLoginType from "../../../utils/auth-helpers/login/determine-admin-login-type"
import retrieveAdminFromContact from "../../../utils/auth-helpers/login/retrieve-admin-from-contact"

export default async function adminLogin (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password } = req.body.loginInformation as AdminLoginInformation
		const contactType = determineAdminLoginType(contact)

		const admin = await retrieveAdminFromContact(contact, contactType)
		if (_.isNull(admin)) return res.status(400).json({ message: `${contactType} not found!` })

		const doPasswordsMatch = await Hash.checkPassword(password, admin.password)
		if (doPasswordsMatch === false) return res.status(400).json({ message: "Wrong Username or Password!" })

		const accessToken = createAndSignAdminJWT(admin._id)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginRecord(admin._id, true)

		return res.status(200).json({
			accessToken,
			firstName: admin.firstName,
			lastName: admin.lastName,
			email: admin.email,
			username: admin.username,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login" })
	}
}
