import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"

const friendIdSchema = Joi.object({
	friendId: Joi.string().required()
}).required()

export default function validateFriendIdInRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = friendIdSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid friend Id" })

	req.friendId = new Types.ObjectId(req.body.friendId as string)

	next()
}
