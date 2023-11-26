import _ from "lodash"
import Joi from "joi"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"

const usernameSchema = Joi.object({
	friendId: Joi.string().required()
})

export default function validateFriendIdInRequest (req: Request, res: Response, next: NextFunction): void | Response {
	const { error } = usernameSchema.validate(req.body)

	if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid friend Id" })

	req.friendId = new Types.ObjectId(req.body.friendId as string)

	next()
}
