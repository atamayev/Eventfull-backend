import _ from "lodash"
import { Response, Request } from "express"
import AwsSnsService from "../../classes/aws-sns-service"
import addLoginRecord from "../../utils/auth-helpers/add-login-record"
import doesContactExist from "../../utils/auth-helpers/does-contact-exist"
import doesUsernameExist from "../../utils/auth-helpers/does-username-exist"
import createAndSignJWT from "../../utils/auth-helpers/jwt/create-and-sign-jwt"
import { addLocalUser, hashPassword } from "../../utils/auth-helpers/register/register-helpers"

export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, username, password,
			notificationToken, primaryDevicePlatform, contactType } = req.body.registerInformationObject as RegisterInformationObject

		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) return res.status(400).json({ message: `${contactType} already exists` })

		const { hashedPassword, hashError } = await hashPassword(password)
		if (!_.isUndefined(hashError)) return res.status(500).json({ error: "Internal Server Error: Unable to Hash Password" })

		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const endpointArn = await AwsSnsService.getInstance().createPlatformEndpoint(notificationToken, primaryDevicePlatform)

		if (_.isUndefined(endpointArn)) return res.status(500).json({ error: "Internal Server Error: Unable to Create Platform Endpoint" })

		const userId = await addLocalUser(req.body.registerInformationObject, hashedPassword, endpointArn)

		const accessToken = createAndSignJWT(userId, true)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginRecord(userId)

		return res.status(200).json({ userId, accessToken })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
