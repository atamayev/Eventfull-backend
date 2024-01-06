import _ from "lodash"
import PrivateChatModel from "../../../models/chat/private/private-message-chat-model"

export default async function retrievePrivateChatsWithNames(user: User): Promise<PrivateChatWithNames[]> {
	try {
		if (_.isEmpty(user.privateChats)) {
			return []
		}

		const privateChatIds = user.privateChats.map(chat => chat.privateChatId)

		const privateChats = await PrivateChatModel.find({
			_id: { $in: privateChatIds },
			isActive: true
		}).exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.privateChats.forEach(chat => {
			chatIdToNameMap[chat.privateChatId.toString()] = chat.chatName
		})

		const chatsWithNames = privateChats.map(chat => {
			return {
				...chat.toObject(),
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat"
			}
		})

		return chatsWithNames as PrivateChatWithNames[]
	} catch (error) {
		console.error(error)
		return []
	}
}
