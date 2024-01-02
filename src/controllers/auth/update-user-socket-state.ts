import { Request, Response } from "express"
import SocketManager from "../../classes/socket-manager"

export default function updateUserSocketState(req: Request, res: Response): Response {
	try {
		const user = req.user
		const appState = req.body.appState as AppStates
		const socketManager = SocketManager.getInstance()
		socketManager.setUserStatus(user._id, appState)

		return res.status(200).json({ success: "User Socket State Updated" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update User Socket" })
	}
}
