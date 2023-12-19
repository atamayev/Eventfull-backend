import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import findUser from "../../utils/find-user"

export default async function attachUnblockedUserToRequest(req: Request, res: Response, next: NextFunction) : Promise<void | Response> {
	try {
		const unblockedUserId = req.unblockedUserId
		const unblockedUser = await findUser(unblockedUserId)

		if (_.isNull(unblockedUser)) return res.status(404).json({ error: "Blocked User not found" })

		req.unblockedUser = unblockedUser as User
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Attach Unblocked User to Request" })
	}
}
