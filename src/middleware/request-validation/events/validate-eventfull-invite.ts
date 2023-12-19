import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const inviteFriendSchema = Joi.object({
	eventfullEventId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	friendId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default function validateEventfullInvite (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = inviteFriendSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.message })

		req.friendId = new Types.ObjectId(req.body.friendId as string)

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Eventfull Invite" })
	}
}
