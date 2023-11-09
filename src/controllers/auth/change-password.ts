import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../setup-and-security/hash"
import { retrieveUserPassword, updatePassword } from "../../utils/auth-helpers/change-password-helpers"

export default async function changePassword (req: Request, res: Response): Promise<Response> {
	const { currentPassword, newPassword } = req.body.changePasswordObject as ChangePasswordObject
	const userId = req.headers.userId as string

	try {
		const hashedOldPassword = await retrieveUserPassword(userId)
		if (_.isUndefined(hashedOldPassword)) return res.status(500).json({ error: "Error in changing password" })

		const isOldPasswordMatch = await Hash.checkPassword(currentPassword, hashedOldPassword)
		if (isOldPasswordMatch === false) {
			return res.status(400).json({ error: "Old Password is incorrect" })
		} else {
			const isSamePassword = await Hash.checkPassword(newPassword, hashedOldPassword)
			if (isSamePassword === true) {
				return res.status(402).json({ error: "New Password cannot be the same as the old password" })
			}

			const newHashedPassword = await Hash.hashCredentials(newPassword)
			await updatePassword(newHashedPassword, userId)
			return res.status(200).json()
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Errror in changing password" })
	}
}
