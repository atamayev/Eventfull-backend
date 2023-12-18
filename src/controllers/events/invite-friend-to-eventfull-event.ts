import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function inviteFriendToEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend
		const event = req.event

		await EventfullEventModel.findByIdAndUpdate(
			event._id,
			{
				$push: {
					invitees: {
						userId: friend._id,
						attendingStatus: "Not Responded",
						invitedBy: user._id
					}
				}
			},
			{ new: true, runValidators: true }
		)

		await UserModel.updateOne(
			{ _id: friend._id },
			{
				$push: {
					eventfullEvents: {
						eventId: event._id,
						attendingStatus: "Not Responded",
						invitedBy: user._id
					}
				}
			}
		)

		return res.status(200).json({ message: "Friend invited to event" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
