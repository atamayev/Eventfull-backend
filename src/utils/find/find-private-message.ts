import _ from "lodash"
import { Types } from "mongoose"
import PrivateMessageModel from "../../models/chat/private/private-message-model"

export default async function findPrivateMessage(
	privateMessageId: Types.ObjectId,
	select?: string
): Promise<PrivateMessageWithChatId | null> {
	let message
	if (!_.isUndefined(select)) {
		message = await PrivateMessageModel.findById(privateMessageId).select(select).lean()
	} else {
		message = await PrivateMessageModel.findById(privateMessageId).lean()
	}
	return message
}
