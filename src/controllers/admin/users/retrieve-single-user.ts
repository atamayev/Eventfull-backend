import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response } from "express"
import findUser from "../../../utils/find/find-user"

export default async function retrieveSingleUser(req: Request, res: Response): Promise<Response> {
	try {
		const userId = req.params.userId as string
		const user = await findUser(
			userId as unknown as Types.ObjectId,
			"_id email firstName lastName email phoneNumber friends username createdAt updatedAt loginHistory"
		)

		if (_.isNull(user))	return res.status(400).json({ message: "User not found" })

		return res.status(200).json({ user })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create User" })
	}
}
