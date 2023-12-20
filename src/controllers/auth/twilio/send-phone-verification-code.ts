import { Response, Request } from "express"
import twilio from "twilio"
import generateVerificationCode from "../../../utils/auth-helpers/twilio/generate-verification-code"
import UserModel from "../../../models/user-model"

export default async function sendPhoneVerificationCode(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

		const phoneVerificationCode = generateVerificationCode()
		await twilioClient.messages.create({
			body: `Your verification code is: ${phoneVerificationCode}`,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: user.phoneNumber as string
		})
		const now = new Date()

		await UserModel.findByIdAndUpdate(user._id, {
			phoneVerificationCode,
			phoneVerificationCodeTimestamp: now,
		})

		return res.status(200).json({ message: "Verification Code Sent to Phone" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Verification Code to Phone" })
	}
}
