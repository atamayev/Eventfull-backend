import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findUser from "../../utils/find/find-user"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"

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

		req.user = user
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
