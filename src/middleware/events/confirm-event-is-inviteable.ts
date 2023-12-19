import { NextFunction, Request, Response } from "express"

export default function confirmEventIsInviteable(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const event = req.event

		const canInvitedUsersInviteOthers = event.canInvitedUsersInviteOthers
		if (canInvitedUsersInviteOthers === false) {
			return res.status(400).json({ error: "This event does not allow invited users to invite others" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm the Event allows for Users to invite others." })
	}
}
