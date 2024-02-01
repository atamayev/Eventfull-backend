import _ from "lodash"
import { Response, Request } from "express"
import AdminModel from "../../../models/admin-model"
import addLoginRecord from "../../../utils/auth-helpers/add-login-record"
import createAndSignAdminJWT from "../../../utils/auth-helpers/jwt/create-and-sign-admin-jwt"
import retrieveAdminFromContact from "../../../utils/auth-helpers/login/retrieve-admin-from-contact"

export default async function adminLoginOTP (req: Request, res: Response): Promise<Response> {
	try {
		const email = req.body.email
		const otp = req.body.otp

		const admin = await retrieveAdminFromContact(email, "Email")
		if (_.isNull(admin)) return res.status(400).json({ message: "Email not found!" })

		const savedOTP = admin.emailVerificationCode
		if (_.isUndefined(savedOTP)) return res.status(400).json({ message: "OTP not found!" })
		if (savedOTP !== otp) return res.status(400).json({ message: "OTP does not match!" })

		const accessToken = createAndSignAdminJWT(admin._id)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await AdminModel.findByIdAndUpdate(admin._id, {
			$unset: { emailVerificationCode: "" }
		})

		await addLoginRecord(admin._id, true)

		return res.status(200).json({
			accessToken,
			firstName: admin.firstName,
			lastName: admin.lastName,
			email: admin.email,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with OTP" })
	}
}
