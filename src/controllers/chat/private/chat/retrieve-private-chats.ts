import { Request, Response } from "express"
import retrievePrivateChatsWithNames from "../../../../utils/chat/retrieve-private-chats-with-names"

export default async function retrievePrivateChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const privateChats = await retrievePrivateChatsWithNames(user)

		return res.status(200).json({ privateChats })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Private Chats" })
	}
}
