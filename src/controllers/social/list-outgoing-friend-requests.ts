import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function listOutgoingFriendRequests (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const outgoingFriendRequestIds = user.outgoingFriendRequests

		const userRequests = await UserModel.find({
			"_id": { $in: outgoingFriendRequestIds }
		}).select("username")

		const usernames = userRequests.map(user1 => user1.username)

		return res.status(200).json({ outgoingFriendRequests: usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Outgoing Friend Requests" })
	}
}
