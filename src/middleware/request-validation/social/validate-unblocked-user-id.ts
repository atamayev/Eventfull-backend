import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const unblockedUserIdSchema = Joi.object({
	unblockedUserId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default function validateUnblockedUserId (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = unblockedUserIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

		req.unblockedUserId = new Types.ObjectId(req.body.unblockedUserId as string)

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Validate Unblocked User Id" })
	}
}
