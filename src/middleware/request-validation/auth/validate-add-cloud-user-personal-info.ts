import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const newCloudUserInfo = Joi.object({
	cloudUserRegisterInformationObject: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		username: Joi.string().required(),
	}).required()
})

export default function validateAddCloudUserPersonalInfo (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = newCloudUserInfo.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Add Cloud User Personal Info" })
	}
}
