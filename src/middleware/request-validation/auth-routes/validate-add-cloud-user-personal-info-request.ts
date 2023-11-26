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

export default function validateAddCloudUserPersonalInfoRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = newCloudUserInfo.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	next()
}
