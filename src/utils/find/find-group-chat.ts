import _ from "lodash"
import { Types } from "mongoose"
import GroupChatModel from "../../models/chat/group/group-chat-model"

export default async function findGroupChat(groupChatId: Types.ObjectId, select?: string): Promise<GroupChat | null> {
	let groupChat
	if (!_.isUndefined(select)) {
		groupChat = await GroupChatModel.findById(groupChatId).select(select)
	} else {
		groupChat = await GroupChatModel.findById(groupChatId)
	}
	return groupChat as GroupChat
}
