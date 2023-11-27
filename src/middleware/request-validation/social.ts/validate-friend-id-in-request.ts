import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import UserModel from "../../../models/user-model"

const friendIdSchema = Joi.object({
	friendId: Joi.string().required()
}).required()

export default async function validateFriendIdInRequest (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = friendIdSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ error: "Invalid friend Id" })

		req.friendId = new Types.ObjectId(req.body.friendId as string)

		const friendUsername = await UserModel.findById(req.friendId).select("username")
		req.friendUsername = friendUsername?.username || ""

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
