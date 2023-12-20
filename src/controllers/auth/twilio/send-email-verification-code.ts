import { Response, Request } from "express"
import sgMail from "@sendgrid/mail"
import generateVerificationCode from "../../../utils/auth-helpers/twilio/generate-verification-code"
import UserModel from "../../../models/user-model"

export default async function sendEmailVerificationCode(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		sgMail.setApiKey(process.env.SENDGRID_API_KEY)
		const emailVerificationCode = generateVerificationCode()
		const msg = {
			to: user.email as string,
			from: process.env.SENDGRID_FROM_EMAIL,
			subject: "Eventfull Verification Code",
			html: `Your Verification code is: <strong>${emailVerificationCode}</strong>`,
		}

		await sgMail.send(msg)

		const now = new Date()

		await UserModel.findByIdAndUpdate(user._id, {
			emailVerificationCode,
			emailVerificationCodeTimestamp: now,
		})

		return res.status(200).json({ message: "Verification Code Sent to Email" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Verification Code to Email" })
	}
}
