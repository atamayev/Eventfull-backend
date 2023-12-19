import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../utils/auth-helpers/get-decoded-id"
import findUser from "../utils/find-user"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).unknown(true)

export default async function jwtVerify(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = authorizationSchema.validate(req.headers)

		if (!_.isUndefined(error)) return handleUnauthorized()

		const accessToken = req.headers.authorization as string

		const userId = getDecodedId(accessToken)

		if (_.isUndefined(userId)) return handleUnauthorized()

		const user = await findUser(userId)

		if (_.isNull(user)) return handleUnauthorized()

		req.userId = new Types.ObjectId(userId)
		req.user = user
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(500).json({ error: "Internal Server Error: Unauthorized User" })
	}
}
