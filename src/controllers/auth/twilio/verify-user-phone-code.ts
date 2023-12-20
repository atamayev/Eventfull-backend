import { Response, Request } from "express"
import UserModel from "../../../models/user-model"

export default async function verifyUserPhoneCode(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { code } = req.body
		// 10 minutes in milliseconds:
		const codeValidityDuration = 600000
		const phoneVerificationCodeTimestamp = user.phoneVerificationCodeTimestamp as Date

		const codeTimestamp = phoneVerificationCodeTimestamp.getTime()
		const isCodeValid = user.phoneVerificationCode === code
		if (isCodeValid === false) return res.status(400).json({ error: "Invalid Code" })

		const isCodeExpired = new Date().getTime() - codeTimestamp < codeValidityDuration
		if (isCodeExpired === false) return res.status(400).json({ error: "Code Expired" })

		await UserModel.findByIdAndUpdate(user._id, {
			isPhoneVerified: true,
			phoneVerificationCode: null,
			phoneVerificationCodeTimestamp: null,
		})

		return res.status(200).json({ message: "Code is Valid. Phone Number Verified" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Send Verification Code" })
	}
}
