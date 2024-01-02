import express from "express"

import validateCalendarId from "../../middleware/request-validation/calendar/validate-calendar-id"
import assignGoogleCalendarAccessToken from "../../middleware/calendar/assign-google-calendar-access-token"
import validateCreateCloudEvent from "../../middleware/request-validation/calendar/validate-create-cloud-event"
import validateUpdateGoogleCalendarEvent from "../../middleware/request-validation/calendar/validate-update-google-calendar-event"

import getGoogleCalendarEvents from "../../controllers/calendar/google/get-google-calendar-events"
import createGoogleCalendarEvent from "../../controllers/calendar/google/create-google-calendar-event"
import deleteGoogleCalendarEvent from "../../controllers/calendar/google/delete-google-calendar-event"
import updateGoogleCalendarEvent from "../../controllers/calendar/google/update-google-calendar-event"

const googleCalendarRoutes = express.Router()

googleCalendarRoutes.post("/create-calendar-event", assignGoogleCalendarAccessToken, validateCreateCloudEvent, createGoogleCalendarEvent)

googleCalendarRoutes.get("/get-calendar-events", assignGoogleCalendarAccessToken, getGoogleCalendarEvents)

googleCalendarRoutes.post(
	"/update-calendar-event",
	assignGoogleCalendarAccessToken,
	validateUpdateGoogleCalendarEvent,
	updateGoogleCalendarEvent
)

googleCalendarRoutes.delete("/delete-calendar-event/:calendarId",
	validateCalendarId,
	assignGoogleCalendarAccessToken,
	deleteGoogleCalendarEvent
)

export default googleCalendarRoutes
