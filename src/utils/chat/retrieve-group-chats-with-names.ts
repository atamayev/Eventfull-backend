import _ from "lodash"
import GroupChatModel from "../../models/chat/group/group-chat-model"

export default async function retrieveGroupChatsWithNames(user: User): Promise<GroupChatWithName[]> {
	try {
		if (_.isEmpty(user.groupChats)) {
			return []
		}

		const chatIdToNameMap = new Map<string, string>()
		const groupChatIds = user.groupChats.map(chat => {
			chatIdToNameMap.set(chat.groupChatId.toString(), chat.chatName)
			return chat.groupChatId
		})

		const groupChats = await GroupChatModel.find({
			_id: { $in: groupChatIds },
			isActive: true
		}).lean().exec()

		const chatsWithNames: GroupChatWithName[] = groupChats.map(chat => ({
			...chat,
			chatName: chatIdToNameMap.get(chat._id.toString()) || "Unnamed Chat",
		}))

		return chatsWithNames
	} catch (error) {
		console.error(error)
		return []
	}
}
