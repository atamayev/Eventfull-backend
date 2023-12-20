import { Response, Request } from "express"
import UserModel from "../../../models/user-model"

export default async function verifyUserEmailCode(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { code } = req.body
		// 10 minutes in milliseconds:
		const codeValidityDuration = 600000
		const emailVerificationCodeTimestamp = user.emailVerificationCodeTimestamp as Date

		const codeTimestamp = emailVerificationCodeTimestamp.getTime()
		const isCodeValid = user.emailVerificationCode === code
		if (isCodeValid === false) return res.status(400).json({ error: "Invalid Code" })

		const isCodeExpired = new Date().getTime() - codeTimestamp < codeValidityDuration
		if (isCodeExpired === false) return res.status(400).json({ error: "Code Expired" })

		await UserModel.findByIdAndUpdate(user._id, {
			isEmailVerified: true,
			emailVerificationCode: null,
			emailVerificationCodeTimestamp: null,
		})

		return res.status(200).json({ message: "Email Verified" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Verify Email Verification Code" })
	}
}
