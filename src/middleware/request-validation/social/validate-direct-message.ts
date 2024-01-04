import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findChat from "../../../utils/find/find-chat"
import objectIdValidation from "../../../utils/object-id-validation"

const directMessageSchema = Joi.object({
	chatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
	message: Joi.string().min(1).max(1000).required(),
}).required()

export default async function validateDirectMessage (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = directMessageSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const chatId = new Types.ObjectId(req.body.chatId as string)

		const chat = await findChat(chatId)

		if (_.isNull(chat)) return res.status(400).json({ message: "Chat not found" })

		req.chat = chat

		next()
	} catch (error ) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Direct Message" })
	}
}
