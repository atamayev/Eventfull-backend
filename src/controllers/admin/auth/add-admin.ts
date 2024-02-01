import sgMail from "@sendgrid/mail"
import { Response, Request } from "express"
import AdminModel from "../../../models/admin-model"
import doesAdminEmailExist from "../../../utils/auth-helpers/does-admin-email-exist"
import { addInitialAdminInfo } from "../../../utils/auth-helpers/register/admin-register-helpers"
import generateVerificationCode from "../../../utils/auth-helpers/twilio/generate-verification-code"

export default async function addAdmin(req: Request, res: Response): Promise<Response> {
	try {
		const { email } = req.body.initialAdminRegisterInformation as InitialAdminRegisterInformation

		const emailExists = await doesAdminEmailExist(email)
		if (emailExists === true) return res.status(400).json({ message: "Admin Email Already Registered." })

		const adminId = await addInitialAdminInfo(req.body.initialAdminRegisterInformation)

		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		const emailVerificationCode = generateVerificationCode()
		const msg = {
			to: email,
			from: process.env.SENDGRID_FROM_EMAIL,
			subject: "Eventfull Admin Verification Code",
			html: `Your Admin Verification code is: <strong>${emailVerificationCode}</strong>`,
		}

		await sgMail.send(msg)

		await AdminModel.findByIdAndUpdate(adminId, {
			emailVerificationCode,
		})

		return res.status(200).json({ success: "Admin added, Verification Code Sent to Email"})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
