import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findDirectMessageChat from "../../../../utils/find/find-direct-message-chat"
import objectIdValidation from "../../../../utils/object-id-validation"

const directMessageSchema = Joi.object({
	chatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	newDirectMessageChatName: Joi.string().min(1).max(200).required()
}).required()

export default async function validateDirectMessageChatId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = directMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const chatId = new Types.ObjectId(req.body.chatId as string)

		const chat = await findDirectMessageChat(chatId)

		if (_.isNull(chat)) return res.status(400).json({ message: "Chat not found" })

		req.directMessageChat = chat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Direct Message Chat Id" })
	}
}
