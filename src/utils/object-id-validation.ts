import Joi from "joi"
import { Types } from "mongoose"

export default function objectIdValidation (value: string, helpers: Joi.CustomHelpers): string | Joi.ErrorReport {
	if (Types.ObjectId.isValid(value) === false) {
		return helpers.error("any.invalid")
	}
	return value
}
