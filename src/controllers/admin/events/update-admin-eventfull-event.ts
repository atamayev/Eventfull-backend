import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"
import AwsStorageService from "../../../classes/aws-storage-service"
import EventfullEventModel from "../../../models/eventfull-event-model"

export default async function updateAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventfullEventData = req.body.eventfullEventData as EventfullEvent
		const numberOfImages = req.body.numberOfImages as number
		delete eventfullEventData.__v

		let updatedEvent = await EventfullEventModel.findByIdAndUpdate(
			eventfullEventData._id,
			eventfullEventData,
			{ new: true }
		)

		if (_.isNull(updatedEvent)) return res.status(400).json({ message: "Event not found" })

		const imagesURLsData = []
		if (numberOfImages !== 0) {
			for (let i = 0; i < numberOfImages; i++) {
				const imageId = uuidv4()
				const presignedUrl = await AwsStorageService.getInstance().generatePresignedURL(imageId)
				// eslint-disable-next-line max-depth
				if (!_.isUndefined(presignedUrl)) {
					imagesURLsData.push({ imageId, presignedUrl })
					updatedEvent.eventImages.push({ imageId, isActive: true })
				}
			}
			await updatedEvent.save()
		}

		updatedEvent = updatedEvent.toObject()

		updatedEvent.eventImages = updatedEvent.eventImages.filter(image => image.isActive === true)

		return res.status(200).json({ updatedEvent, imagesURLsData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Event" })
	}
}
