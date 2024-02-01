import _ from "lodash"
import { Response, Request } from "express"
import doesUsernameExist from "../../../utils/auth-helpers/does-username-exist"
import { hashPassword } from "../../../utils/auth-helpers/register/register-helpers"
import { addUsernameAndPassword } from "../../../utils/auth-helpers/register/admin-register-helpers"

export default async function finishAdminRegistration(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const { username, password } = req.body.secondaryAdminRegisterInformation as SecondaryAdminRegisterInformation

		const { hashedPassword, hashError } = await hashPassword(password)
		if (!_.isUndefined(hashError)) return res.status(500).json({ error: "Internal Server Error: Unable to Hash Password" })

		const usernameExists = await doesUsernameExist(username, true)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		await addUsernameAndPassword(admin._id, username, hashedPassword)

		return res.status(200).json({ success: "Admin Registered" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
