import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../utils/object-id-validation"

const friendIdSchema = Joi.object({
	friendId: Joi.string().custom(objectIdValidation, "Object ID Validation").required()
}).required()

export default function validateFriendId (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = friendIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid friend Id" })

		req.friendId = new Types.ObjectId(req.body.friendId as string)

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error: Unable to Validate Friend Id " })
	}
}
