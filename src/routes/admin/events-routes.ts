import express from "express"

import validateEventId from "../../middleware/request-validation/events/validate-event-id"
import confirmEventFrequencyAttributes from "../../middleware/events/confirm-event-frequency-attributes"
import validateCreateEventfullEvent from "../../middleware/request-validation/events/validate-create-eventfull-event"
import validateUpdateEventfullEvent from "../../middleware/request-validation/events/validate-update-eventfull-event"

import addAdminEventfullEvent from "../../controllers/admin/events/add-admin-eventfull-event"
import retrieveEventfullEvents from "../../controllers/admin/events/retrieve-eventfull-events"
import updateAdminEventfullEvent from "../../controllers/admin/events/update-admin-eventfull-event"
import retrieveSingleEventfullEvent from "../../controllers/admin/events/retrieve-single-eventfull-event"
import deleteAdminEventfullEvent from "../../controllers/admin/events/delete-admin-eventfull-event"
import addImageURLs from "../../controllers/admin/events/add-image-urls"
import validateEventfullEventId from "../../middleware/request-validation/events/validate-eventfull-event-id"
import validateImageURLs from "../../middleware/request-validation/admin/events/validate-image-urls"

const adminEventsRoutes = express.Router()

adminEventsRoutes.post(
	"/add-event",
	validateCreateEventfullEvent,
	confirmEventFrequencyAttributes,
	addAdminEventfullEvent
)

adminEventsRoutes.post(
	"/update-event",
	validateUpdateEventfullEvent,
	confirmEventFrequencyAttributes,
	updateAdminEventfullEvent
)

adminEventsRoutes.get("/get-events", retrieveEventfullEvents)

adminEventsRoutes.get("/get-event/:eventId", validateEventId, retrieveSingleEventfullEvent)

adminEventsRoutes.delete("/delete-event/:eventId", validateEventId, deleteAdminEventfullEvent)

adminEventsRoutes.post("/add-image-urls",
	validateEventfullEventId, // TODO: change this to validate the event id in the params
	validateImageURLs,
	addImageURLs
)

export default adminEventsRoutes
