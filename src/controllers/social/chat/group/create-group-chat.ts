import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

export default async function createGroupChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friends = req.friends

		const participantIds = friends.map(friend => friend._id)
		participantIds.push(user._id)

		const userChatName = friends.map(friend => friend.username || friend.firstName).join(", ")

		const groupChat = await GroupChatModel.create({
			participants: participantIds,
			lastMessage: null,
		})

		await UserModel.findByIdAndUpdate(user._id, {
			$push: {
				groupChats: {
					groupChatId: groupChat._id,
					chatName: userChatName
				}
			},
		})

		await Promise.all(friends.map(friend => {
			const friendChatName = [user.username || user.firstName, ...friends
				.filter(f => f._id.toString() !== friend._id.toString())
				.map(f => f.username || f.firstName)
			].join(", ")

			return UserModel.findByIdAndUpdate(friend._id, {
				$push: {
					groupChats: {
						groupChatId: groupChat._id,
						chatName: friendChatName
					}
				},
			})
		}))

		return res.status(200).json({ groupChatId: groupChat._id })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Chat" })
	}
}
