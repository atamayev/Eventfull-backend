import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findGroupChat from "../../../../../utils/find/find-group-chat"
import objectIdValidation from "../../../../../utils/object-id-validation"
import findGroupMessage from "../../../../../utils/find/find-group-message"

const groupMessageSchema = Joi.object({
	groupMessageId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default async function validateGroupMessageIdInParams (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = groupMessageSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const groupMessage = await findGroupMessage(req.params.groupMessageId as unknown as Types.ObjectId)

		if (_.isNull(groupMessage)) return res.status(400).json({ message: "Group Message not found" })

		req.groupMessage = groupMessage

		const groupChat = await findGroupChat(groupMessage.groupChatId)

		if (_.isNull(groupChat)) return res.status(400).json({ message: "Group Chat not found" })

		req.groupChat = groupChat

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Group Message Id" })
	}
}
