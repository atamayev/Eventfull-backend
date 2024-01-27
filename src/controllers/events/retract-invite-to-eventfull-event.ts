import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function retractInviteToEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const friend = req.friend
		const event = req.event

		const eventfullPull = EventfullEventModel.findByIdAndUpdate(
			event._id,
			{
				$pull: {
					invitees: { "user.userId" : friend._id }
				}
			},
			{ runValidators: true }
		)

		const userPull = UserModel.findByIdAndUpdate(
			friend._id,
			{
				$pull: {
					eventfullEvents: { eventId: event._id }
				}
			},
			{ runValidators: true }
		)

		await Promise.all([eventfullPull, userPull])

		return res.status(200).json({ success: "Invitation retracted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retract Invite to Eventfull Event" })
	}
}
