import { Request, Response, NextFunction } from "express"

export default function confirmUserIsGroupChatParticipant (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const groupChat = req.groupChat

		const isChatParticipant = groupChat.participants.some((participant) => participant.equals(user._id))
		if (isChatParticipant === false) {
			return res.status(400).json({ message: "You are not a participant of this chat" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm if user is a chat participant" })
	}
}
