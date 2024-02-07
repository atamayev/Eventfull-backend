import { Request, Response } from "express"
import UserModel from "../../../models/user-model"

export default async function retrieveUsers(req: Request, res: Response): Promise<Response> {
	try {
		// TODO: Down the line, will need to add pagination
		const users = await UserModel.find()
			.select("_id firstName lastName email phoneNumber friends username createdAt updatedAt loginHistory")
			.lean()

		return res.status(200).json({ users })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Users" })
	}
}
