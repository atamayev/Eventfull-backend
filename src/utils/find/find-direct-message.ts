import _ from "lodash"
import { Types } from "mongoose"
import DirectMessageModel from "../../models/chat/direct-message-model"

export default async function findDirectMessage(messageId: Types.ObjectId, select?: string): Promise<DirectMessageWithChatId | null> {
	let message
	if (!_.isUndefined(select)) {
		message = await DirectMessageModel.findById(messageId).select(select)
	} else {
		message = await DirectMessageModel.findById(messageId)
	}
	return message as DirectMessageWithChatId
}
