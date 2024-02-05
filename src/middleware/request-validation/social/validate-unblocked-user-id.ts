import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../utils/find/find-user"
import objectIdValidation from "../../../utils/object-id-validation"

const unblockedUserIdSchema = Joi.object({
	unblockedUserId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default async function validateUnblockedUserId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = unblockedUserIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const unblockedUser = await findUser(req.body.unblockedUserId as unknown as Types.ObjectId)

		if (_.isNull(unblockedUser)) return res.status(400).json({ message: "Blocked User not found" })

		req.unblockedUser = unblockedUser as User

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Unblocked User Id" })
	}
}
