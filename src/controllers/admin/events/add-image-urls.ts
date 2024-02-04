import _ from "lodash"
import { Request, Response } from "express"

export default async function addImageURLs(req: Request, res: Response): Promise<Response> {
	try {
		const event = req.event
		const imageURLs: EventImages[] = req.body.imageURLs

		// Iterate over incoming imageURLs and update the event
		imageURLs.forEach(incomingImage => {
			const { imageId, imageURL } = incomingImage
			const existingImage = event.eventImages.find(ei => ei.imageId === imageId)

			if (!_.isUndefined(existingImage)) {
				existingImage.imageURL = imageURL
			} else {
				event.eventImages.push({ imageId, imageURL })
			}
		})

		await event.save()

		return res.status(200).json({ success: "Added Image URLs" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add image URLs" })
	}
}
