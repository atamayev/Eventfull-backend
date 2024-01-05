import _ from "lodash"
import { Types } from "mongoose"
import GroupMessageModel from "../../models/chat/group/group-message-model"

export default async function findGroupMessage(messageId: Types.ObjectId, select?: string): Promise<GroupMessageWithChatId | null> {
	let message
	if (!_.isUndefined(select)) {
		message = await GroupMessageModel.findById(messageId).select(select)
	} else {
		message = await GroupMessageModel.findById(messageId)
	}
	return message as GroupMessageWithChatId
}
