import Joi from "joi"
import _ from "lodash"
import { Types } from "mongoose"
import { Request, Response, NextFunction } from "express"
import findPrivateChat from "../../../../utils/find/find-private-chat"
import objectIdValidation from "../../../../utils/object-id-validation"

const privateMessageSchema = Joi.object({
	privateChatId: Joi.string().custom(objectIdValidation, "Object ID Validation").required(),
}).required()

export default async function validatePrivateChatIdInParams (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = privateMessageSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const privateChat = await findPrivateChat(req.params.privateChatId as unknown as Types.ObjectId)

		if (_.isNull(privateChat)) return res.status(400).json({ message: "Private Chat not found" })

		req.privateChat = privateChat

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Private Message Chat Id" })
	}
}
