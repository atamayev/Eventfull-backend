import express from "express"

import addAdminEventfullEvent from "../../controllers/admin/events/add-admin-eventfull-event"
import retrieveEventfullEvents from "../../controllers/admin/events/retrieve-eventfull-events"
import validateCreateEventfullEvent from "../../middleware/request-validation/events/validate-create-eventfull-event"
import confirmEventFrequencyAttributes from "../../middleware/events/confirm-event-frequency-attributes"

const adminEventsRoutes = express.Router()

adminEventsRoutes.post(
	"/add-event",
	validateCreateEventfullEvent,
	confirmEventFrequencyAttributes,
	addAdminEventfullEvent
)

adminEventsRoutes.get("/get-events", retrieveEventfullEvents)

export default adminEventsRoutes
