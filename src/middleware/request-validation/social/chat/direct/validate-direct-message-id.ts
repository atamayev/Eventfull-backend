import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import objectIdValidation from "../../../../../utils/object-id-validation"
import findDirectMessage from "../../../../../utils/find/find-direct-message"
import findDirectMessageChat from "../../../../../utils/find/find-direct-message-chat"

const directMessageSchema = Joi.object({
	directMessageId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateDirectMessageId(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = directMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const directMessageId = new Types.ObjectId(req.body.directMessageId as string)

		const directMessage = await findDirectMessage(directMessageId)

		if (_.isNull(directMessage)) return res.status(400).json({ message: "Direct Message not found" })

		req.directMessage = directMessage

		const chat = await findDirectMessageChat(directMessage.directMessageChatId)

		if (_.isNull(chat)) return res.status(400).json({ message: "Chat not found" })

		req.directMessageChat = chat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Direct Message" })
	}
}
