import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function listFriends (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friendIds = user.friends

		const friends = await UserModel.find({
			"_id": { $in: friendIds }
		}).select("_id username")

		const transformedFriends = friends.map(friend => {
			return {
				userId: friend._id,
				username: friend.username
			}
		})

		return res.status(200).json({ friends: transformedFriends })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to List Friends" })
	}
}
