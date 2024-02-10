import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"
import EventfullEventModel from "../../../models/eventfull-event-model"
import AwsStorageService from "../../../classes/aws-storage-service"
import EventTypeModel from "../../../models/event-type-model"

// eslint-disable-next-line max-lines-per-function
export default async function updateAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const eventfullEventData = req.body.eventfullEventData as EventfullEvent
		const numberOfImages = req.body.numberOfImages as number
		delete eventfullEventData.__v

		const newUpdatedEvent = await EventfullEventModel.findByIdAndUpdate(
			eventfullEventData._id,
			eventfullEventData,
			{ new: true }
		)

		if (_.isNull(newUpdatedEvent)) return res.status(400).json({ message: "Event not found" })

		const imagesURLsData = []
		if (numberOfImages !== 0) {
			for (let i = 0; i < numberOfImages; i++) {
				const imageId = uuidv4()
				const presignedUrl  = await AwsStorageService.getInstance().generatePresignedURL(imageId)
				// eslint-disable-next-line max-depth
				if (!_.isUndefined(presignedUrl)) {
					imagesURLsData.push({ imageId, presignedUrl })
					// Add the imageId to the newEvent's images array
					newUpdatedEvent.eventImages.push({ imageId, isActive: true })
				}
			}
			await newUpdatedEvent.save()
		}

		newUpdatedEvent.eventImages = newUpdatedEvent.eventImages.filter(image => image.isActive === true)

		const eventTypeDoc = await EventTypeModel.findById(newUpdatedEvent.eventType).lean()

		if (_.isNull(eventTypeDoc)) {
			return res.status(500).json({ message: "Internal Server Error: Unable to Retrieve Single Event (eventTypeName is null)" })
		}

		const updatedEvent: OutgoingEventfullEvent = {
			...newUpdatedEvent,
			eventType: {
				eventTypeId: newUpdatedEvent.eventType,
				eventTypeName: eventTypeDoc.eventTypeName
			}
		}

		return res.status(200).json({ updatedEvent, imagesURLsData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Update Event" })
	}
}
