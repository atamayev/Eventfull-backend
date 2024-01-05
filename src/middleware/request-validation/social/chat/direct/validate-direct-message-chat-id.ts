import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findDirectMessageChat from "../../../../../utils/find/find-direct-message-chat"
import objectIdValidation from "../../../../../utils/object-id-validation"

const directMessageSchema = Joi.object({
	directMessageChatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).unknown(true)

export default async function validateDirectMessageChatId (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = directMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const directMessageChatId = new Types.ObjectId(req.body.directMessageChatId as string)

		const directMessageChat = await findDirectMessageChat(directMessageChatId)

		if (_.isNull(directMessageChat)) return res.status(400).json({ message: "Direct Message Chat not found" })

		req.directMessageChat = directMessageChat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Direct Message Chat Id" })
	}
}
