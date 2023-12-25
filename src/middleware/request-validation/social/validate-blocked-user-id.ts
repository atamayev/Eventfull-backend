import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const blockedUserIdSchema = Joi.object({
	blockedUserId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default function validateBlockedUserId (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = blockedUserIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		req.blockedUserId = new Types.ObjectId(req.body.blockedUserId as string)

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Validate Blocked User Id" })
	}
}
