import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"
import findUser from "../../../utils/find-user"

const blockedUserIdSchema = Joi.object({
	blockedUserId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default async function validateBlockedUserId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = blockedUserIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

		req.blockedUserId = new Types.ObjectId(req.body.blockedUserId as string)

		const blockedUserUsername = await findUser(req.blockedUserId, "username")
		req.blockedUserUsername = blockedUserUsername?.username || ""

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
