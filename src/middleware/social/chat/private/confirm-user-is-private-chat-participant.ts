import { Request, Response, NextFunction } from "express"

export default function confirmUserIsPrivateChatParticipant (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const user = req.user
		const privateChat = req.privateChat

		const isChatParticipant = privateChat.participants.some((participant) => participant.equals(user._id))
		if (isChatParticipant === false) {
			return res.status(400).json({ message: "You are not a participant of this chat" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Confirm if User is a Chat Participant" })
	}
}
