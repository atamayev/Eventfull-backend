import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import { doesUserIdExist, getDecodedId } from "../utils/auth-helpers/jwt-verify-helpers"

export default async function jwtVerify(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const accessToken = req.headers.authorization

		if (_.isUndefined(accessToken)) return handleUnauthorized()

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
