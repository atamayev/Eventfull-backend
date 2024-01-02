import { Response, Request } from "express"
import UserModel from "../../models/user-model"
import Hash from "../../classes/hash"
import isSameContactMethod from "../../utils/auth-helpers/is-same-contact-method"

export default async function changePassword (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, currentPassword, newPassword } = req.body.changePasswordObject as ChangePasswordObject
		const user = req.user
		const contactType = req.contactType
		const doesUserHaveContactType = isSameContactMethod(user, contact, contactType)

		if (doesUserHaveContactType === false) return res.status(400).json({ message: `${contactType} does not match what is on file.` })

		const isOldPasswordMatch = await Hash.checkPassword(currentPassword, user.password)
		if (isOldPasswordMatch === false) {
			return res.status(400).json({ message: "Old Password is incorrect" })
		}

		const isSamePassword = await Hash.checkPassword(newPassword, user.password)
		if (isSamePassword === true) {
			return res.status(400).json({ message: "New Password cannot be the same as the Previous Password" })
		}

		const newHashedPassword = await Hash.hashCredentials(newPassword)
		await UserModel.findByIdAndUpdate(user._id, { password: newHashedPassword }, { runValidators: true })
		return res.status(200).json({ success: "Password changed successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Change Password" })
	}
}
