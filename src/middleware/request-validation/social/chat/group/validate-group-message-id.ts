import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../../../utils/object-id-validation"
import findGroupMessage from "../../../../../utils/find/find-group-message"
import findGroupMessageChat from "../../../../../utils/find/find-group-message-chat"

const groupMessageSchema = Joi.object({
	groupMessageId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateGroupMessageId(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = groupMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const groupMessageId = new Types.ObjectId(req.body.groupMessageId as string)

		const groupMessage = await findGroupMessage(groupMessageId)

		if (_.isNull(groupMessage)) return res.status(400).json({ message: "Group Message not found" })

		req.groupMessage = groupMessage

		const chat = await findGroupMessageChat(groupMessage.chatId)

		if (_.isNull(chat)) return res.status(400).json({ message: "Chat not found" })

		req.groupMessageChat = chat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Group Message" })
	}
}
