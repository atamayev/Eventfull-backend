import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"

const friendRequestResponseSchema = Joi.object({
	friendId: Joi.string().required(),
	response: Joi.string().valid("Accept", "Decline").required()
}).required()

export default function validateFriendRequestResponse (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = friendRequestResponseSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

	req.friendId = new Types.ObjectId(req.body.friendId as string)

	next()
}
