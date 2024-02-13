import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Request, Response } from "express"
import AwsStorageService from "../../../classes/aws-storage-service"
import EventfullEventModel from "../../../models/eventfull-event-model"
import convertAdminEventToEventfullEvent from "../../../utils/events/convert-admin-event-to-eventfull-event"

export default async function addAdminEventfullEvent(req: Request, res: Response): Promise<Response> {
	try {
		const admin = req.admin
		const eventfullEventData = req.body.eventfullEventData as IncomingEventfullEvent
		const numberOfImages = req.body.numberOfImages as number

		const eventfullEvent = convertAdminEventToEventfullEvent(admin, eventfullEventData)

		const newEvent = await EventfullEventModel.create(eventfullEvent)

		const imagesURLsData = []
		for (let i = 0; i < numberOfImages; i++) {
			const imageId = uuidv4()
			const presignedUrl  = await AwsStorageService.getInstance().generatePresignedURL(imageId)
			if (!_.isUndefined(presignedUrl)) {
				imagesURLsData.push({ imageId, presignedUrl })
				// Add the imageId to the newEvent's images array
				newEvent.eventImages.push({ imageId, isActive: true })
			}
		}
		await newEvent.save()

		return res.status(200).json({ newEvent, imagesURLsData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Event" })
	}
}
