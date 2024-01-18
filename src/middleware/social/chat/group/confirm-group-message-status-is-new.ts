import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmGroupMessageStatusIsNew(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const newPrivateMessageStatus = req.body.newMessageStatus
		const groupMessage = req.groupMessage
		const userMessageStatusObject = groupMessage.messageStatuses.find(status => status.userId.equals(user._id))

		if (!_.isUndefined(userMessageStatusObject)) {
			if (userMessageStatusObject.messageStatus === newPrivateMessageStatus) {
				return res.status(400).json({ message: "Same Status" })
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if message status is new" })
	}
}
