import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function removePinnedEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const eventfullEventId = req.body.eventfullEventId as string

		await UserModel.updateOne(
			{ _id: userId },
			{ $pull: { eventPins: eventfullEventId } }
		)

		return res.status(200).json({ message: "Event Un-Pinned" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
