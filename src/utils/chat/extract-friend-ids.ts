import { Types } from "mongoose"

export function extractGroupChatFriendIds(groupChat: GroupChat, userId: Types.ObjectId): Types.ObjectId[] {
	const friendIds = groupChat.participantDetails
		.filter(participant => !participant.userId.equals(userId))
		.map(participant => participant.userId)

	return friendIds
}

export function extractPrivateChatFriendId(privateChat: PrivateChat, userId: Types.ObjectId): Types.ObjectId {
	const friendId = privateChat.participantDetails
		.filter(participant => !participant.userId.equals(userId))
		.map(participant => participant.userId)

	return friendId[0]
}
