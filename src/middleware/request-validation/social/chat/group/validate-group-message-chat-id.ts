import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findGroupChat from "../../../../../utils/find/find-group-chat"
import objectIdValidation from "../../../../../utils/object-id-validation"

const groupMessageSchema = Joi.object({
	groupChatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateGroupChatId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = groupMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const groupChatId = new Types.ObjectId(req.body.groupChatId as string)

		const groupChat = await findGroupChat(groupChatId)

		if (_.isNull(groupChat)) return res.status(400).json({ message: "Group Chat not found" })

		req.groupChat = groupChat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Group Message Chat Id" })
	}
}
