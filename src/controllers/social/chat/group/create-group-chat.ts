import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

// eslint-disable-next-line max-lines-per-function
export default async function createGroupChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friends = req.friends

		const participantDetails = friends.map(friend => ({
			_id: friend._id,
			username: friend.username,
		}))

		const userChatName = friends.map(friend => friend.username || friend.firstName).join(", ")

		const groupChat = await GroupChatModel.create({
			participantDetails,
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
			// The Chat Name for the friend is the user's name and the other friends' names
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
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Group Chat" })
	}
}
