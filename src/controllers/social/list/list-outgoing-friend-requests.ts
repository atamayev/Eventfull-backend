import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function listOutgoingFriendRequests (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const outgoingFriendRequestIds = user.outgoingFriendRequests

		const outgoingFriendRequests = await UserModel.find({
			"_id": { $in: outgoingFriendRequestIds }
		}).select("_id username")

		return res.status(200).json({ outgoingFriendRequests })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Outgoing Friend Requests" })
	}
}
