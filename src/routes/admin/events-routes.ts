import express from "express"

import addAdminEventfullEvent from "../../controllers/admin/events/add-admin-eventfull-event"
import validateAdminCreateEventfullEvent from "../../middleware/request-validation/admin/events/validate-admin-eventfull-event"
import retrieveEventfullEvents from "../../controllers/admin/events/retrieve-eventfull-events"

const adminEventsRoutes = express.Router()

adminEventsRoutes.post(
	"/add-event",
	validateAdminCreateEventfullEvent,
	//add a middleware to confirm that events with event frequency one time have an event time,
	// or that events with event frequency ongoing have ongoing event times, etc.
	addAdminEventfullEvent
)

adminEventsRoutes.get("/get-events", retrieveEventfullEvents)

export default adminEventsRoutes
