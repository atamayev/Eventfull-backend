import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"

const blockedUserIdSchema = Joi.object({
	blockedUserId: Joi.string().required()
}).required()

export default function validateBlockedUserIdInRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = blockedUserIdSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	req.blockedUserId = new Types.ObjectId(req.body.blockedUserId as string)

	next()
}
