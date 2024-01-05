import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findGroupMessageChat from "../../../../../utils/find/find-group-message-chat"
import objectIdValidation from "../../../../../utils/object-id-validation"

const groupMessageSchema = Joi.object({
	groupMessageChatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateGroupMessageChatId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = groupMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const groupMessageChatId = new Types.ObjectId(req.body.groupMessageChatId as string)

		const chat = await findGroupMessageChat(groupMessageChatId)

		if (_.isNull(chat)) return res.status(400).json({ message: "Group Chat not found" })

		req.groupMessageChat = chat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Group Message Chat Id" })
	}
}
