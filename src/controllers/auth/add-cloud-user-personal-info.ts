import { Response, Request } from "express"
import { addCloudUser } from "../../utils/auth-helpers/register/register-helpers"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"

export default async function addCloudUserPersonalInfo (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const { username } = req.body.cloudUserRegisterInformationObject as CloudUserRegisterInformationObject

		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		await addCloudUser(user._id, req.body.cloudUserRegisterInformationObject)

		return res.status(200).json({ success: "Cloud user Pesonal Info added" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Cloud User Personal Info" })
	}
}
