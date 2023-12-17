import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const deleteEventfullEventSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default function validateDeleteEventfullEvent (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = deleteEventfullEventSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error" })
	}
}
