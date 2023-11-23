import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../../models/user-model"
import { doesUserIdExist, getDecodedId } from "../../../utils/auth-helpers/jwt-verify-helpers"

const querySchema = Joi.object({
	code: Joi.string().required()
}).unknown(true)

export default async function validateCalendarRequest (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	const { error } = querySchema.validate(req.query)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	let email: string | undefined
	try {
		const state = JSON.parse(req.query.state as string)
		const userId = getDecodedId(state.accessToken)
		if (_.isUndefined(userId)) return handleUnauthorized()

		const doesRecordExist = await doesUserIdExist(userId)

		if (doesRecordExist === false) return handleUnauthorized()

		const user = await UserModel.findById(userId).select("email").lean().exec()
		email = user?.email
	} catch (error1) {
		console.error(error1)
		return res.status(400).json({error: "Bad Request: State is not valid JSON"})
	}

	if (_.isUndefined(email)) return handleUnauthorized()

	req.headers.email = email

	next()

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
