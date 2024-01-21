import _ from "lodash"
import GroupChatModel from "../../../models/chat/group/group-chat-model"

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

		const chatsWithNames: GroupChatWithNames[] = groupChats.map(chat => {
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
