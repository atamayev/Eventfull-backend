import _ from "lodash"
import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function updateLocalCalendarData (req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const calendarDetails = req.body.calendarDetails as UnifiedCalendarEvent

		const user = await UserModel.findById(userId)

		if (_.isNil(user)) return res.status(404).json({ error: "User not found" })

		const eventIndex = user.calendarData.findIndex(event => {
			return _.toString(event.id) === calendarDetails.id
		})

		if (eventIndex === -1) return res.status(404).json({ error: "Calendar event not found" })

		calendarDetails.isActive = true

		user.calendarData[eventIndex] = calendarDetails

		await user.save()

		return res.status(200).json({ message: "Calendar event updated successfully" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Failed to update calendar data" })
	}
}
