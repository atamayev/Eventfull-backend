import _ from "lodash"
import { Request, Response } from "express"
import EventCategoryModel from "../../../../models/event-category-model"

export default async function addEventCategory(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const incomingEventCategory = req.body.eventCategoryDetails as IncomingEventCategory
		const existingEventCategory = await EventCategoryModel.findOne({
			eventCategoryName: incomingEventCategory.eventCategoryName
		}).lean()

		let eventCategory
		if (_.isNull(existingEventCategory)) {
			eventCategory = await EventCategoryModel.create({
				...incomingEventCategory,
				createdBy: {
					adminId: admin._id,
					username: admin.username,
					createdAt: new Date(),
				}
			})
		} else {
			if (existingEventCategory.isActive === true) {
				return res.status(400).json({ message: "Event Category already exists" })
			}
			eventCategory = await EventCategoryModel.findByIdAndUpdate(
				existingEventCategory._id,
				{
					...incomingEventCategory,
					isActive: true
				}, { new: true }
			)
		}

		return res.status(200).json({ eventCategory })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event Category" })
	}
}
