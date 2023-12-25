import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import findUser from "../../utils/find-user"

export default async function attachBlockedUserToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const blockedUserId = req.blockedUserId
		const blockedUser = await findUser(blockedUserId)

		if (_.isNull(blockedUser)) return res.status(400).json({ message: "Blocked User not found" })

		req.blockedUser = blockedUser as User
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Attach Blocked User to Request" })
	}
}
