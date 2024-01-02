import express from "express"

import validateCalendarId from "../../middleware/request-validation/calendar/validate-calendar-id"
import validateCreateCloudEvent from "../../middleware/request-validation/calendar/validate-create-cloud-event"
import assignMicrosoftCalendarIdAndAccessToken from "../../middleware/calendar/assign-microsoft-calendar-id-and-access-token"
import validateUpdateMicrosoftCalendarEvent from "../../middleware/request-validation/calendar/validate-update-microsoft-calendar-event"

import getMicrosoftCalendarEvents from "../../controllers/calendar/microsoft/get-microsoft-calendar-events"
import createMicrosoftCalendarEvent from "../../controllers/calendar/microsoft/create-microsoft-calendar-event"
import updateMicrosoftCalendarEvent from "../../controllers/calendar/microsoft/update-microsoft-calendar-event"
import deleteMicrosoftCalendarEvent from "../../controllers/calendar/microsoft/delete-microsoft-calendar-event"

const microsoftCalendarRoutes = express.Router()

microsoftCalendarRoutes.post(
	"/create-calendar-event",
	assignMicrosoftCalendarIdAndAccessToken,
	validateCreateCloudEvent,
	createMicrosoftCalendarEvent
)

microsoftCalendarRoutes.get("/get-calendar-events", assignMicrosoftCalendarIdAndAccessToken, getMicrosoftCalendarEvents)

microsoftCalendarRoutes.post(
	"/update-calendar-event",
	assignMicrosoftCalendarIdAndAccessToken,
	validateUpdateMicrosoftCalendarEvent,
	updateMicrosoftCalendarEvent
)

microsoftCalendarRoutes.delete(
	"/delete-calendar-event/:calendarId",
	validateCalendarId,
	assignMicrosoftCalendarIdAndAccessToken,
	deleteMicrosoftCalendarEvent
)

export default microsoftCalendarRoutes
