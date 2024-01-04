import _ from "lodash"
import { Types } from "mongoose"
import DirectMessageChatModel from "../../models/chat/direct-message-chat-model"

export default async function findDirectMessageChat(chatId: Types.ObjectId, select?: string): Promise<DirectMessageChat | null> {
	let chat
	if (!_.isUndefined(select)) {
		chat = await DirectMessageChatModel.findById(chatId).select(select)
	} else {
		chat = await DirectMessageChatModel.findById(chatId)
	}
	return chat as DirectMessageChat
}
