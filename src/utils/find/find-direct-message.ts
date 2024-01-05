import _ from "lodash"
import { Types } from "mongoose"
import DirectMessageModel from "../../models/chat/direct/direct-message-model"

export default async function findDirectMessage(directMessageId: Types.ObjectId, select?: string): Promise<DirectMessageWithChatId | null> {
	let message
	if (!_.isUndefined(select)) {
		message = await DirectMessageModel.findById(directMessageId).select(select)
	} else {
		message = await DirectMessageModel.findById(directMessageId)
	}
	return message as DirectMessageWithChatId
}
