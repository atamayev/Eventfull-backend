import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const updateOnlyShowEventfullEventsSchema = Joi.object({
	onlyShowEventfullEvents: Joi.boolean().required()
}).required()

export default function validateUpdateOnlyShowEventfullEvents (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = updateOnlyShowEventfullEventsSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid onlyShowEventfullEvents" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate onlyShowEventfullEvents" })
	}
}
