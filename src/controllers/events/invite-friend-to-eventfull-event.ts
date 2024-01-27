import { Request, Response } from "express"
import UserModel from "../../models/user-model"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function inviteFriendToEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friend = req.friend
		const event = req.event

		const pushToEventfullEvent = EventfullEventModel.findByIdAndUpdate(
			event._id,
			{
				$push: {
					invitees: {
						user: {
							userId: friend._id,
							username: friend.username
						},
						attendingStatus: "Not Responded",
						invitedBy: {
							userId: user._id,
							username: user.username
						}
					}
				}
			},
			{ runValidators: true }
		)

		const pushToUser = UserModel.findByIdAndUpdate(
			friend._id,
			{
				$push: {
					eventfullEvents: {
						eventId: event._id,
						attendingStatus: "Not Responded",
						invitedBy: {
							userId: user._id,
							username: user.username
						}
					}
				}
			},
			{ runValidators: true }
		)

		await Promise.all([pushToEventfullEvent, pushToUser])

		return res.status(200).json({ success: `${friend.username || "Friend"} invited to event` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Invite Friend to Eventfull Event" })
	}
}
