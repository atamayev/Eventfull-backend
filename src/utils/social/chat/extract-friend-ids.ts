import { Types } from "mongoose"

export function extractGroupChatFriendIds(groupChat: GroupChat, userId: Types.ObjectId): Types.ObjectId[] {
	const friendIds = groupChat.participantDetails
		.filter(participant => !participant._id.equals(userId))
		.map(participant => participant._id)

	return friendIds
}

export function extractPrivateChatFriendId(privateChat: PrivateChat, userId: Types.ObjectId): Types.ObjectId {
	const friendId = privateChat.participantDetails
		.filter(participant => !participant._id.equals(userId))
		.map(participant => participant._id)

	return friendId[0]
}
