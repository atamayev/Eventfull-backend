import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"

const unblockedUserIdSchema = Joi.object({
	unblockedUserId: Joi.string().required()
}).required()

export default function validateUnblockedUserIdInRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = unblockedUserIdSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	req.unblockedUserId = new Types.ObjectId(req.body.unblockedUserId as string)

	next()
}
