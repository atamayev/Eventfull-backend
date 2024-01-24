import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const querySchema = Joi.object({
	lastMessageId: Joi.string().optional(),
	limit: Joi.number().integer().min(1).optional().default(20)
}).unknown(true)

export default function validateMessagePaginationQueryParams(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error, value } = querySchema.validate(req.query)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		req.query = value

		if (req.query.limit) {
			req.query.limit = req.query.limit.toString()
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Chat Query" })
	}
}
