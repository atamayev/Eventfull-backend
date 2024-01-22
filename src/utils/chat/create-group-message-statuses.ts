import { Types } from "mongoose"

export default function createGroupMessageStatuses(
	participantDetails: SocialData[],
	userId: Types.ObjectId
): MessageStatusObjectNoTimestamps[] {
	return participantDetails.map(participant => ({
		userId: participant.userId,
		messageStatus: participant.userId.toString() === userId.toString() ? "Sender" : "Sent", // Set to "Sender" if userIds match
		username: participant.username,
	}))
}
