import _ from "lodash"
import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"

export default async function addEventType(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const incomingEventType = req.body.eventTypeDetails as IncomingEventType
		const existingEventType = await EventTypeModel.findOne({
			eventTypeName: incomingEventType.eventTypeName
		}).lean()

		let eventType
		if (_.isNull(existingEventType)) {
			eventType = await EventTypeModel.create({
				...incomingEventType,
				createdBy: {
					adminId: admin._id,
					username: admin.username,
					createdAt: new Date(),
				}
			})
		}
		else {
			if (existingEventType.isActive === true) {
				return res.status(400).json({ message: "Event Type already exists" })
			}
			eventType = await EventTypeModel.findByIdAndUpdate(
				existingEventType._id,
				{
					...incomingEventType,
					isActive: true
				}, { new: true }
			)
		}

		return res.status(200).json({ eventType })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event Type" })
	}
}
