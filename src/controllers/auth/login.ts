import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../classes/hash"
import addLoginRecord from "../../utils/auth-helpers/add-login-record"
import retrieveUserFromContact from "../../utils/auth-helpers/login/retrieve-user-from-contact"
import determineLoginType from "../../utils/auth-helpers/login/determine-login-type"
import doesUserHaveGoogleCalendar from "../../utils/google/calendar/does-user-have-google-calendar"
import setUserContact from "../../utils/set-user-contact"
import createAndSignJWT from "../../utils/auth-helpers/jwt/create-and-sign-jwt"
import updateArn from "../../utils/auth-helpers/aws/update-arn"
import isUserContactVerified from "../../utils/is-user-contact-verified"

export default async function login (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password, notificationToken, primaryDevicePlatform } = req.body.loginInformationObject as LoginInformationObject
		const contactType = determineLoginType(contact)

		const user = await retrieveUserFromContact(contact, contactType)
		if (_.isNull(user)) return res.status(400).json({ message: `${contactType} not found!` })

		if (user.authMethod === "Google") {
			return res.status(400).json({ message: "Username exists, but you must login via Google" })
		} else if (user.authMethod === "Microsoft") {
			return res.status(400).json({ message: "Username exists, but you must login via Microsoft" })
		}

		const doPasswordsMatch = await Hash.checkPassword(password, user.password)
		if (doPasswordsMatch === false) return res.status(400).json({ message: "Wrong Username or Password!" })

		const accessToken = createAndSignJWT(user._id)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		const isUserConnectedGoogleCalendar = await doesUserHaveGoogleCalendar(user._id)
		await updateArn(user, notificationToken, primaryDevicePlatform)

		await addLoginRecord(user._id)
		const primaryContact = user.primaryContactMethod
		const userContact = setUserContact(primaryContact, user)

		const isContactVerified = isUserContactVerified(primaryContact, user)

		return res.status(200).json({
			userId: user._id,
			accessToken,
			isUserConnectedGoogleCalendar,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			primaryContact,
			userContact,
			isContactVerified,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login" })
	}
}
