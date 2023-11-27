import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../../models/user-model"

const friendRequestResponseSchema = Joi.object({
	friendId: Joi.string().required(),
	response: Joi.string().valid("Accept", "Decline").required()
}).required()

export default async function validateFriendRequestResponse (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = friendRequestResponseSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: error.details[0].message })

		req.friendId = new Types.ObjectId(req.body.friendId as string)

		const friendUsername = await UserModel.findById(req.friendId).select("username")
		req.friendUsername = friendUsername?.username || ""

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
