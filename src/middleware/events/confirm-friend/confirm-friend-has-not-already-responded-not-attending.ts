import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../../models/user-model"

export default async function confirmFriendHasNotAlreadyRespondedNotAttending(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const friendId = req.friendId
		const user = await UserModel.findById(friendId)

		if (_.isNull(user)) return res.status(404).json({ error: "User not found" })

		const eventfullEventId = req.body.eventfullEventId as string
		const hasRespondedNotAttending = user.eventfullEvents.some(event =>
			event.eventId.toString() === eventfullEventId && event.attendingStatus === "Not Attending"
		)

		if (hasRespondedNotAttending === true) {
			return res.status(400).json({ error: "Friend has already responded 'Not Attending'" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Interal Server Error" })
	}
}
