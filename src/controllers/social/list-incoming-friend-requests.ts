import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function listIncomingFriendRequests (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const incomingFriendRequestIds = user.incomingFriendRequests

		const userRequests = await UserModel.find({
			"_id": { $in: incomingFriendRequestIds }
		}).select("username")

		const usernames = userRequests.map(user1 => user1.username)

		return res.status(200).json({ incomingFriendRequests: usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Incoming Friend Requests" })
	}
}
