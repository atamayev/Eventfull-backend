import _ from "lodash"
import PrivateChatModel from "../../../models/chat/private/private-chat-model"
import getUsernameById from "../../get-username-by-id"

export default async function retrievePrivateChatsWithNames(user: User): Promise<PrivateChatWithNames[]> {
	try {
		if (_.isEmpty(user.privateChats)) {
			return []
		}

		const privateChatIds = user.privateChats.map(chat => chat.privateChatId)

		const privateChats = await PrivateChatModel.find({
			_id: { $in: privateChatIds },
			isActive: true
		}).lean().exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.privateChats.forEach(chat => {
			chatIdToNameMap[chat.privateChatId.toString()] = chat.chatName
		})

		const chatsWithNames: PrivateChatWithNames[] = await Promise.all(privateChats.map(async chat => {
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

		return chatsWithNames as PrivateChatWithNames[]
	} catch (error) {
		console.error(error)
		return []
	}
}