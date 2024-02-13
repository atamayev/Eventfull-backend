import { Request, Response } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveEventsFeed(req: Request, res: Response): Promise<Response> {
	try {
		const currentDate = new Date()
		const events = await EventfullEventModel.aggregate([
		// Match initial conditions
			{
				$match: {
					isActive: true,
					eventPublic: true,
					eventImages: {
						$elemMatch: {
							isActive: true,
							imageURL: { $exists: true, $ne: "" }
						}
					}
				}
			},

			// Determine if the event is in the future
			{
				$addFields: {
					isInFuture: {
						$switch: {
							branches: [
								{
									case: { $eq: ["$eventFrequency", "one-time"] },
									then: { $gt: ["$singularEventTime.startTime", currentDate] }
								},
								{
									case: { $eq: ["$eventFrequency", "custom"] },
									then: {
										$gt: [
											{ $max: "$customEventDates.startTime" },
											currentDate
										]
									}
								},
								{
									case: { $eq: ["$eventFrequency", "ongoing"] },
									then: true // Assuming ongoing events are always considered in the future; adjust as needed
								}
							],
							default: false
						}
					}
				}
			},

			// Filter documents that are in the future
			{ $match: { isInFuture: true } },

			// Sort by createdAt in descending order
			{ $sort: { createdAt: -1 } }
		])

		return res.status(200).json({ events })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Events Feed" })
	}
}
