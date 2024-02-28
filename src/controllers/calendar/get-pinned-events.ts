import _ from "lodash"
import { Response, Request } from "express"
import EventfullEventModel from "../../models/eventfull-event-model"

export default async function getPinnedEvents (req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user

		if (_.isEmpty(user.eventPins)) {
			return res.status(200).json({ pinnedEvents: [] })
		}

		const pinnedEvents = await Promise.all(user.eventPins.map(async (pinId) => {
			const event = await EventfullEventModel.findById(pinId)
			if (_.isNull(event)) return
			return { eventId: pinId, eventName: event.eventName }
		}))

		return res.status(200).json({ pinnedEvents })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Pinned Events" })
	}
}
