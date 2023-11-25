import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import { doesUserIdExist, getDecodedId } from "../utils/auth-helpers/jwt-verify-helpers"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).unknown(true)

export default async function jwtVerify(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = authorizationSchema.validate(req.headers)

		const accessToken = req.headers.authorization

		if (!_.isUndefined(error) || _.isUndefined(accessToken)) return handleUnauthorized()

		const userId = getDecodedId(accessToken)

		if (_.isUndefined(userId)) return handleUnauthorized()

		const doesRecordExist = await doesUserIdExist(userId)

		if (doesRecordExist === false) return handleUnauthorized()

		req.userId = new Types.ObjectId(userId)
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
