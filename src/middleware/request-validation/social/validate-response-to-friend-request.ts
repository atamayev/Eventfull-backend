import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../utils/find/find-user"
import objectIdValidation from "../../../utils/object-id-validation"

const responseToFriendRequestSchema = Joi.object({
	friendId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	response: Joi.string().valid("Accept", "Decline").required()
}).required()

export default async function validateResponseToFriendRequest (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = responseToFriendRequestSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const friend = await findUser(req.body.friendId as unknown as Types.ObjectId)

		if (_.isNull(friend)) return res.status(400).json({ message: "Friend not found" })

		req.friend = friend as User

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Response to Friend Request" })
	}
}
