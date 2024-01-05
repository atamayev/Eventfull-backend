import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findUser from "../../../../utils/find/find-user"
import objectIdValidation from "../../../../utils/object-id-validation"

const friendIdsSchema = Joi.object({
	friendIds: Joi.array()
		.items(Joi.string().custom(objectIdValidation, "Object ID Validation"))
		.min(2)
		.max(6)
		.required(),
}).required()

export default async function validateFriendIds (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = friendIdsSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const friendsPromises = req.body.friendIds.map((id: string) =>
			findUser(new Types.ObjectId(id as string))
		)
		const friends = await Promise.all(friendsPromises)

		// Check for any null (not found) users
		if (friends.some(friend => _.isNull(friend))) {
			return res.status(400).json({ message: "One or more friends not found" })
		}

		req.friends = friends as User[]

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Friend Ids" })
	}
}
