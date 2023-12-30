import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../utils/find/find-user"
import objectIdValidation from "../../../utils/object-id-validation"

const blockedUserIdSchema = Joi.object({
	blockedUserId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default async function validateBlockedUserId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = blockedUserIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const blockedUserId = new Types.ObjectId(req.body.blockedUserId as string)

		const blockedUser = await findUser(blockedUserId)

		if (_.isNull(blockedUser)) return res.status(400).json({ message: "Blocked User not found" })

		req.blockedUser = blockedUser as User

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Blocked User Id" })
	}
}
