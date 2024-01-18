import _ from "lodash"
import GroupChatModel from "../../../models/chat/group/group-chat-model"
import getUsernameById from "../../get-username-by-id"

export default async function retrieveGroupChatsWithNames(user: User): Promise<GroupChatWithNames[]> {
	try {
		if (_.isEmpty(user.groupChats)) {
			return []
		}

		const groupChatIds = user.groupChats.map(chat => chat.groupChatId)

		const groupChats = await GroupChatModel.find({
			_id: { $in: groupChatIds },
			isActive: true
		}).lean().exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.groupChats.forEach(groupChat => {
			chatIdToNameMap[groupChat.groupChatId.toString()] = groupChat.chatName
		})

		const chatsWithNames: GroupChatWithNames[] = await Promise.all(groupChats.map(async chat => {
			let lastMessageWithSenderDetails = null

			if (!_.isNull(chat.lastMessage)) {
				const senderUsername = await getUsernameById(chat.lastMessage.senderDetails.userId)
				lastMessageWithSenderDetails = {
					...chat.lastMessage,
					senderDetails: {
						userId: chat.lastMessage.senderDetails.userId,
						username: senderUsername
					}
				}
			}

			return {
				...chat,
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat",
				lastMessage: lastMessageWithSenderDetails
			}
		}))

		return chatsWithNames as GroupChatWithNames[]
	} catch (error) {
		console.error(error)
		return []
	}
}
