export default function createGroupMessageStatuses(participantDetails: SocialData[]): MessageStatusObjectNoTimestamps[] {
	return participantDetails.map(participant => ({
		userId: participant.userId,
		messageStatus: "Sent", // Default status
		username: participant.username,
	}))
}
