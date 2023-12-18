import { Request, Response } from "express"
import UserModel from "../../models/user-model"

export default async function pinEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.userId
		const event = req.event

		await UserModel.updateOne(
			{ _id: userId },
			{ $addToSet: { eventPins: event._id } }
		)

		return res.status(200).json({ message: "Event Pinned" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
