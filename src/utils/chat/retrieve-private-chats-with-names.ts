import _ from "lodash"
import PrivateChatModel from "../../models/chat/private/private-chat-model"

export default async function retrievePrivateChatsWithNames(user: User): Promise<PrivateChatWithNames[]> {
	try {
		if (_.isEmpty(user.privateChats)) {
			return []
		}

		const chatIdToNameMap = new Map<string, string>()
		const privateChatIds = user.privateChats.map(chat => {
			chatIdToNameMap.set(chat.privateChatId.toString(), chat.chatName)
			return chat.privateChatId
		})

		const privateChats = await PrivateChatModel.find({
			_id: { $in: privateChatIds },
			isActive: true
		}).lean().exec()

		const chatsWithNames: PrivateChatWithNames[] = privateChats.map(chat => ({
			...chat,
			chatName: chatIdToNameMap.get(chat._id.toString()) || "Unnamed Chat",
		}))

		return chatsWithNames
	} catch (error) {
		console.error(error)
		return []
	}
}
