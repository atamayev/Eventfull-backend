import express from "express"

import validateEventId from "../../middleware/request-validation/events/validate-event-id"
import validateEventTypeId from "../../middleware/request-validation/events/validate-event-type-id"
import validateImageURLs from "../../middleware/request-validation/admin/events/validate-image-urls"
import confirmEventFrequencyAttributes from "../../middleware/events/confirm-event-frequency-attributes"
import validateEventCategoryId from "../../middleware/request-validation/events/validate-event-category-id"
import validateCreateEventType from "../../middleware/request-validation/events/validate-create-event-type"
import validateUpdateEventType from "../../middleware/request-validation/events/validate-update-event-type"
import validateEventfullEventId from "../../middleware/request-validation/events/validate-eventfull-event-id"
import validateCreateEventCategory from "../../middleware/request-validation/events/validate-create-event-category"
import validateUpdateEventCategory from "../../middleware/request-validation/events/validate-update-event-category"
import validateCreateEventfullEvent from "../../middleware/request-validation/events/validate-create-eventfull-event"
import validateUpdateEventfullEvent from "../../middleware/request-validation/events/validate-update-eventfull-event"

import getEventTypes from "../../controllers/lists/get-event-types"
import addImageURLs from "../../controllers/admin/events/add-image-urls"
import getEventCategories from "../../controllers/lists/get-event-categories"
import addEventType from "../../controllers/admin/events/event-types/add-event-type"
import deleteEventType from "../../controllers/admin/events/event-types/delete-event-type"
import updateEventType from "../../controllers/admin/events/event-types/update-event-type"
import addAdminEventfullEvent from "../../controllers/admin/events/add-admin-eventfull-event"
import retrieveEventfullEvents from "../../controllers/admin/events/retrieve-eventfull-events"
import addEventCategory from "../../controllers/admin/events/event-categories/add-event-category"
import updateAdminEventfullEvent from "../../controllers/admin/events/update-admin-eventfull-event"
import deleteAdminEventfullEvent from "../../controllers/admin/events/delete-admin-eventfull-event"
import deleteEventCategory from "../../controllers/admin/events/event-categories/delete-event-category"
import updateEventCategory from "../../controllers/admin/events/event-categories/update-event-category"
import retrieveSingleEventfullEvent from "../../controllers/admin/events/retrieve-single-eventfull-event"
import retrieveSingleEventType from "../../controllers/admin/events/event-types/retrieve-single-event-type"
import retrieveSingleEventCategory from "../../controllers/admin/events/event-categories/retrieve-single-event-category"

const adminEventsRoutes = express.Router()

// Events:
adminEventsRoutes.post(
	"/add-event",
	validateCreateEventfullEvent,
	confirmEventFrequencyAttributes,
	addAdminEventfullEvent
)

adminEventsRoutes.get("/get-events", retrieveEventfullEvents)

adminEventsRoutes.get("/get-event/:eventId", validateEventId, retrieveSingleEventfullEvent)

adminEventsRoutes.post(
	"/update-event",
	validateUpdateEventfullEvent,
	confirmEventFrequencyAttributes,
	updateAdminEventfullEvent
)

adminEventsRoutes.delete("/delete-event/:eventId", validateEventId, deleteAdminEventfullEvent)

adminEventsRoutes.post("/add-image-urls/:eventfullEventId",
	validateEventfullEventId,
	validateImageURLs,
	addImageURLs
)

// Event Categories:
adminEventsRoutes.post("/add-event-category", validateCreateEventCategory, addEventCategory)

adminEventsRoutes.get("/get-event-categories", getEventCategories)

adminEventsRoutes.get("/get-event-category/:eventCategoryId", validateEventCategoryId, retrieveSingleEventCategory)

adminEventsRoutes.post("/update-event-category", validateUpdateEventCategory, updateEventCategory)

adminEventsRoutes.delete("/delete-event-category/:eventCategoryId", validateEventCategoryId, deleteEventCategory)

// Event Types:
adminEventsRoutes.post("/add-event-type", validateCreateEventType, addEventType)

adminEventsRoutes.get("/get-event-types", getEventTypes)

adminEventsRoutes.get("/get-event-type/:eventTypeId", validateEventTypeId, retrieveSingleEventType)

adminEventsRoutes.post("/update-event-type", validateUpdateEventType, updateEventType)

adminEventsRoutes.delete("/delete-event-type/:eventTypeId", validateEventTypeId, deleteEventType)

export default adminEventsRoutes
