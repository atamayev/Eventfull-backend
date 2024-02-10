import _ from "lodash"
import { Request, Response } from "express"
import EventTypeModel from "../../../../models/event-type-model"

export default async function addEventType(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const incomingEventType = req.body.eventTypeDetails as IncomingEventType
		const existingEventType = await EventTypeModel.findOne({ eventTypeName: incomingEventType.eventTypeName }).lean()

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
		} else if (existingEventType.isActive === true) {
			return res.status(400).json({ message: "Event Type already exists" })
		} else {
			eventType = await EventTypeModel.findByIdAndUpdate(
				existingEventType._id,
				{
					...incomingEventType,
					isActive: true
				}, { new: true }
			)
		}

		if (_.isNull(eventType)) {
			return res.status(500).json({ message: "Internal Server Error: Unable to Create Event Type (eventTypes is null)" })
		}

		return res.status(200).json({
			_id: eventType._id,
			updatedAt: eventType.updatedAt,
			createdAt: eventType.createdAt,
			createdBy: eventType.createdBy,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event Type" })
	}
}
