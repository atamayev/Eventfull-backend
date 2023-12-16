import Joi from "joi"
import { Types } from "mongoose"

export default function objectIdValidation (value: string, helpers: Joi.CustomHelpers): string  | Joi.ErrorReport {
	if (!Types.ObjectId.isValid(value)) {
		return helpers.error("any.invalid")
	}
	return value
}
