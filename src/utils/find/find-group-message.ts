import _ from "lodash"
import { Types } from "mongoose"
import GroupMessageModel from "../../models/chat/group/group-message-model"

export default async function findGroupMessage(groupMessageId: Types.ObjectId, select?: string): Promise<GroupMessageWithChatId | null> {
	let message
	if (!_.isUndefined(select)) {
		message = await GroupMessageModel.findById(groupMessageId).select(select)
	} else {
		message = await GroupMessageModel.findById(groupMessageId)
	}
	return message
}
