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
import addEventCategory from "../../controllers/admin/events/event-types-and-categories/add-event-category"
import validateCreateEventCategory from "../../middleware/request-validation/events/validate-create-event-category"
import addEventType from "../../controllers/admin/events/event-types-and-categories/add-event-type"
import validateCreateEventType from "../../middleware/request-validation/events/validate-create-event-type"
import deleteEventCategory from "../../controllers/admin/events/event-types-and-categories/delete-event-category"
import deleteEventType from "../../controllers/admin/events/event-types-and-categories/delete-event-type"
import validateEventCategoryId from "../../middleware/request-validation/events/validate-event-category-id"
import validateEventTypeId from "../../middleware/request-validation/events/validate-event-type-id"

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

adminEventsRoutes.post(
	"/add-event-category",
	validateCreateEventCategory,
	addEventCategory
)

adminEventsRoutes.post(
	"/add-event-type",
	validateCreateEventType,
	addEventType
)

adminEventsRoutes.delete(
	"/delete-event-category/:eventCategoryId",
	validateEventCategoryId,
	deleteEventCategory
)

adminEventsRoutes.delete(
	"/delete-event-type/:eventTypeId",
	validateEventTypeId,
	deleteEventType
)

export default adminEventsRoutes
