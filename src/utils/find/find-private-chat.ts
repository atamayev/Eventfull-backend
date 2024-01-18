import _ from "lodash"
import { Types } from "mongoose"
import PrivateChatModel from "../../models/chat/private/private-chat-model"

export default async function findPrivateChat(privateChatId: Types.ObjectId, select?: string): Promise<PrivateChat | null> {
	let privateChat
	if (!_.isUndefined(select)) {
		privateChat = await PrivateChatModel.findById(privateChatId).select(select)
	} else {
		privateChat = await PrivateChatModel.findById(privateChatId)
	}
	return privateChat
}
