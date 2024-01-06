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
		}).exec()

		const chatIdToNameMap: ChatNameMapping = {}
		user.groupChats.forEach(groupChat => {
			chatIdToNameMap[groupChat.groupChatId.toString()] = groupChat.chatName
		})

		const chatsWithNames = groupChats.map(chat => {
			return {
				...chat.toObject(),
				chatName: chatIdToNameMap[chat._id.toString()] || "Unnamed Chat"
			}
		})

		return chatsWithNames as GroupChatWithNames[]
	} catch (error) {
		console.error(error)
		return []
	}
}
