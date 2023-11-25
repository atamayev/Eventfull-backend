import { Request, Response } from "express"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"

export default async function checkIfUsernameExists(req: Request, res: Response): Promise<Response> {
	try {
		const username = req.body.username

		const exists = await doesUsernameExist(username)

		return res.status(200).json({ exists })
	} catch (error) {
		console.error(error)
		return res.status(500).json()
	}
}
