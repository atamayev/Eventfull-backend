import { Response, Request } from "express"
import UserModel from "../../models/user-model"

export default async function updateOnlyShowEventfullEvents (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const onlyShowEventfullEvents = req.body.onlyShowEventfullEvents as boolean

		await UserModel.findByIdAndUpdate(user._id, { onlyShowEventfullEvents })

		return res.status(200).json({ success: "Successfully changed onlyShowEventfullEvents status" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to change onlyShowEventfullEvents status" })
	}
}
