import { Request, Response } from "express"
import UserModel from "../../../../models/user-model"
import GroupChatModel from "../../../../models/chat/group/group-chat-model"

// eslint-disable-next-line max-lines-per-function
export default async function createGroupChat(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const friends = req.friends

		const participantDetails = [
			{
				userId: user._id,
				username: user.username,
			},
			...friends.map(friend => ({
				userId: friend._id,
				username: friend.username,
			}))
		]

		const userChatName = friends.map(friend => friend.username || friend.firstName).join(", ")

		const newGroupChat = await GroupChatModel.create({
			participantDetails,
			lastMessage: null,
		})

		await UserModel.findByIdAndUpdate(user._id, {
			$push: {
				groupChats: {
					groupChatId: newGroupChat._id,
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
						groupChatId: newGroupChat._id,
						chatName: friendChatName
					}
				},
			})
		}))

		const groupChat = addChatNameToChat(newGroupChat, userChatName)

		return res.status(200).json({ groupChat })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Group Chat" })
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addChatNameToChat(chat: any, chatName: string): GroupChatWithName {
	const chatData = chat._doc ? { ...chat._doc } : { ...chat }
	chatData.chatName = chatName
	return chatData
}
