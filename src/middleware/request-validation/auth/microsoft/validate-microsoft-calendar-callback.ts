import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../../../../utils/auth-helpers/get-decoded-id"
import findUser from "../../../../utils/find-user"

const microsoftCalendarCallbackSchema = Joi.object({
	code: Joi.string().required()
}).unknown(true)

export default async function validateMicrosoftCalendarCallback (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	const { error } = microsoftCalendarCallbackSchema.validate(req.query)

	if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

	let email: string | undefined
	try {
		const state = JSON.parse(req.query.state as string) as { accessToken: string }
		const userId = getDecodedId(state.accessToken)
		if (_.isUndefined(userId)) return handleUnauthorized()

		const user = await findUser(userId)

		if (_.isNull(user)) return handleUnauthorized()

		email = user.email
	} catch (error1) {
		console.error(error1)
		return res.status(400).json({message: "Bad Request: State is not valid JSON"})
	}

	if (_.isUndefined(email)) return handleUnauthorized()

	req.headers.email = email

	next()

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
