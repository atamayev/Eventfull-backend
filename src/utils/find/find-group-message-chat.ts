import _ from "lodash"
import { Types } from "mongoose"
import GroupMessageChatModel from "../../models/chat/group-message-chat-model"

export default async function findGroupMessageChat(chatId: Types.ObjectId, select?: string): Promise<GroupMessageChat | null> {
	let chat
	if (!_.isUndefined(select)) {
		chat = await GroupMessageChatModel.findById(chatId).select(select)
	} else {
		chat = await GroupMessageChatModel.findById(chatId)
	}
	return chat as GroupMessageChat
}
