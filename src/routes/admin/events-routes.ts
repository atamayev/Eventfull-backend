import express from "express"

import validateEventId from "../../middleware/request-validation/events/validate-event-id"
import validateImageURLs from "../../middleware/request-validation/admin/events/validate-image-urls"
import confirmEventFrequencyAttributes from "../../middleware/events/confirm-event-frequency-attributes"
import validateEventfullEventId from "../../middleware/request-validation/events/validate-eventfull-event-id"
import validateCreateEventfullEvent from "../../middleware/request-validation/events/validate-create-eventfull-event"
import validateUpdateEventfullEvent from "../../middleware/request-validation/events/validate-update-eventfull-event"

import getEventTypes from "../../controllers/lists/get-event-types"
import addImageURLs from "../../controllers/admin/events/add-image-urls"
import getEventCategories from "../../controllers/lists/get-event-categories"
import addAdminEventfullEvent from "../../controllers/admin/events/add-admin-eventfull-event"
import retrieveEventfullEvents from "../../controllers/admin/events/retrieve-eventfull-events"
import updateAdminEventfullEvent from "../../controllers/admin/events/update-admin-eventfull-event"
import deleteAdminEventfullEvent from "../../controllers/admin/events/delete-admin-eventfull-event"
import retrieveSingleEventfullEvent from "../../controllers/admin/events/retrieve-single-eventfull-event"

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

adminEventsRoutes.post("/add-image-urls/:eventfullEventId",
	validateEventfullEventId,
	validateImageURLs,
	addImageURLs
)

adminEventsRoutes.get("/get-event-types", getEventTypes)
adminEventsRoutes.get("/get-event-categories", getEventCategories)

// TODO: When adding routes to add/delete types and categories, add isActive parameters to the models
// also, add the admin (userId and social data) who added them.
// add timestamps to the models as well.

export default adminEventsRoutes
