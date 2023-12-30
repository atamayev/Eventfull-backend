import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function saveUserNotificationToken(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { notificationToken } = req.body

		if (_.isUndefined(notificationToken)) return res.status(400).json({ error: "Missing notificationToken" })

		await UserModel.findByIdAndUpdate(user._id, { notificationToken })

		return res.status(200).json({ success: "Notification token saved" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
