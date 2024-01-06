import _ from "lodash"
import { Types } from "mongoose"
import DirectMessageChatModel from "../../models/chat/direct/direct-message-chat-model"

export default async function findDirectMessageChat(
	directMessageChatId: Types.ObjectId,
	select?: string
): Promise<DirectMessageChat | null> {
	let directMessageChat
	if (!_.isUndefined(select)) {
		directMessageChat = await DirectMessageChatModel.findById(directMessageChatId).select(select)
	} else {
		directMessageChat = await DirectMessageChatModel.findById(directMessageChatId)
	}
	return directMessageChat
}
