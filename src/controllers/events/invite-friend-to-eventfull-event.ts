import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function inviteFriendToEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const friendId = req.friendId
		const { eventfullEventId } = req.body

		await EventfullEventModel.findByIdAndUpdate(
			eventfullEventId,
			{
				$push: {
					invitees: {
						userId: friendId,
						isAttending: "Not Responded",
						invitedBy: userId
					}
				}
			},
			{ new: true, runValidators: true }
		)

		await UserModel.updateOne(
			{ _id: friendId },
			{
				$push: {
					eventfullEvents: {
						eventId: eventfullEventId,
						isAttending: "Not Responded",
						invitedBy: userId
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
