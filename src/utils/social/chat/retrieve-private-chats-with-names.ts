import _ from "lodash"
import PrivateChatModel from "../../../models/chat/private/private-chat-model"

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

		const chatsWithNames: PrivateChatWithNames[] = privateChats.map(chat => {
			return {
				...chat,
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat",
			}
		})

		return chatsWithNames
	} catch (error) {
		console.error(error)
		return []
	}
}
