import express from "express"

import assignGoogleCalendarAccessToken from "../middleware/calendar/assign-google-calendar-access-token"
import assignMicrosoftCalendarIdAndAccessToken from "../middleware/calendar/assign-microsoft-calendar-id-and-access-token"
import validateAddLocalCalendarEvent from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-event"
import validateUpdateLocalCalendarEvent from "../middleware/request-validation/calendar-routes/validate-update-local-calendar-event"
import validateCalendarIdInParams from "../middleware/request-validation/calendar-routes/validate-calendarId-in-params"
import validateCreateCloudEvent from "../middleware/request-validation/calendar-routes/validate-create-cloud-event"
import validateUpdateGoogleCalendarEvent from "../middleware/request-validation/calendar-routes/validate-update-google-calendar-event"
import validateUpdateMicrosoftCalendarEvent
	from "../middleware/request-validation/calendar-routes/validate-update-microsoft-calendar-event"

import getGoogleCalendarEvents from "../controllers/calendar/google/get-google-calendar-events"
import getMicrosoftCalendarEvents from "../controllers/calendar/microsoft/get-microsoft-calendar-events"
import addLocalCalendarEvent from "../controllers/calendar/local-calendar/add-local-calendar-event"
import getAllDbCalendarEvents from "../controllers/calendar/get-all-db-calendar-events"
import updateLocalCalendarEvent from "../controllers/calendar/local-calendar/update-local-calendar-event"
import deleteLocalCalendarEvent from "../controllers/calendar/local-calendar/delete-local-calendar-event"
import createGoogleCalendarEvent from "../controllers/calendar/google/create-google-calendar-event"
import deleteGoogleCalendarEvent from "../controllers/calendar/google/delete-google-calendar-event"
import updateGoogleCalendarEvent from "../controllers/calendar/google/update-google-calendar-event"
import createMicrosoftCalendarEvent from "../controllers/calendar/microsoft/create-microsoft-calendar-event"
import updateMicrosoftCalendarEvent from "../controllers/calendar/microsoft/update-microsoft-calendar-event"
import deleteMicrosoftCalendarEvent from "../controllers/calendar/microsoft/delete-microsoft-calendar-event"

const calendarRoutes = express.Router()

// Google Calendar Routes
calendarRoutes.post(
	"/google-calendar/create-calendar-event",
	assignGoogleCalendarAccessToken,
	validateCreateCloudEvent,
	createGoogleCalendarEvent
)
calendarRoutes.get("/google-calendar/get-calendar-events", assignGoogleCalendarAccessToken, getGoogleCalendarEvents)
calendarRoutes.post(
	"/google-calendar/update-calendar-event",
	assignGoogleCalendarAccessToken,
	validateUpdateGoogleCalendarEvent,
	updateGoogleCalendarEvent
)
calendarRoutes.delete(
	"/google-calendar/delete-calendar-event/:calendarId",
	assignGoogleCalendarAccessToken,
	validateCalendarIdInParams,
	deleteGoogleCalendarEvent
)

// Microsoft Calendar Routes
calendarRoutes.post(
	"/microsoft-calendar/create-calendar-event",
	assignMicrosoftCalendarIdAndAccessToken,
	validateCreateCloudEvent,
	createMicrosoftCalendarEvent
)
calendarRoutes.get("/microsoft-calendar/get-calendar-events", assignMicrosoftCalendarIdAndAccessToken, getMicrosoftCalendarEvents)
calendarRoutes.post(
	"/microsoft-calendar/update-calendar-event",
	assignMicrosoftCalendarIdAndAccessToken,
	validateUpdateMicrosoftCalendarEvent,
	updateMicrosoftCalendarEvent
)
calendarRoutes.delete(
	"/microsoft-calendar/delete-calendar-event/:calendarId",
	assignMicrosoftCalendarIdAndAccessToken,
	validateCalendarIdInParams,
	deleteMicrosoftCalendarEvent
)

// Local Calendar Routes
calendarRoutes.post("/local-calendar/create-calendar-event", validateAddLocalCalendarEvent, addLocalCalendarEvent)
calendarRoutes.get("/local-calendar/get-all-calendar-events", getAllDbCalendarEvents)
calendarRoutes.post("/local-calendar/update-calendar-event", validateUpdateLocalCalendarEvent, updateLocalCalendarEvent)
calendarRoutes.delete("/local-calendar/delete-calendar-event/:calendarId", validateCalendarIdInParams, deleteLocalCalendarEvent)

export default calendarRoutes
