import { Request, Response } from "express"
import retrieveGroupChatsWithNames from "../../../../utils/chat/retrieve-group-chats-with-names"

export default async function retrieveGroupChats(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		const groupChats = await retrieveGroupChatsWithNames(user)

		return res.status(200).json({ groupChats })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Group Chats" })
	}
}
