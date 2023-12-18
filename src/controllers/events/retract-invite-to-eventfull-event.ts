import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function retractInviteToEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const friendId = req.friendId
		const event = req.event

		await EventfullEventModel.findByIdAndUpdate(
			event._id,
			{
				$pull: {
					invitees: { userId: friendId }
				}
			},
			{ new: true, runValidators: true }
		)

		await UserModel.updateOne(
			{ _id: friendId },
			{
				$pull: {
					eventfullEvents: { eventId: event._id }
				}
			}
		)

		return res.status(200).json({ message: "Invitation retracted" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
