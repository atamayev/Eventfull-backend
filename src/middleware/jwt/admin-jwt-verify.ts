import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import findAdmin from "../../utils/find/find-admin"
import getDecodedAdminId from "../../utils/auth-helpers/get-decoded-admin-id"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).unknown(true)

export default async function adminJwtVerify(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = authorizationSchema.validate(req.headers)

		if (!_.isUndefined(error)) return handleUnauthorized()

		const accessToken = req.headers.authorization as string

		const adminId = getDecodedAdminId(accessToken)

		if (_.isUndefined(adminId)) return handleUnauthorized()

		const admin = await findAdmin(adminId)

		if (_.isNull(admin)) return handleUnauthorized()

		req.admin = admin
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
