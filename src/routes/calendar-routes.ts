import express from "express"

import assignGoogleCalendarId from "../middleware/calendar/assign-google-calendar-id"
import assignMicrosoftCalendarId from "../middleware/calendar/assign-microsoft-calendar-id"
import validateAddLocalCalendarData from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-data-request"
import validateUpdateLocalCalendarData from "../middleware/request-validation/calendar-routes/validate-update-local-calendar-data-request"
import validateCalendarIdInParams from "../middleware/request-validation/calendar-routes/validate-calendarId-in-params"
import validateCreateGoogleEvent from "../middleware/request-validation/calendar-routes/validate-create-google-event"
import validateUpdateGoogleCalendarData from "../middleware/request-validation/calendar-routes/validate-update-google-calendar-data-request"

import getGoogleCalendarDetails from "../controllers/calendar/google/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/microsoft/get-microsoft-calendar-details"
import addLocalCalendarData from "../controllers/calendar/local-calendar/add-local-calendar-data"
import retrieveAllDbCalendarData from "../controllers/calendar/retrieve-all-db-calendar-data"
import updateLocalCalendarData from "../controllers/calendar/local-calendar/update-local-calendar-data"
import deleteLocalCalendarData from "../controllers/calendar/local-calendar/delete-local-calendar-data"
import createGoogleCalendarEvent from "../controllers/calendar/google/create-google-calendar-event"
import deleteGoogleCalendarEvent from "../controllers/calendar/google/delete-google-calendar-event"
import updateGoogleCalendarEvent from "../controllers/calendar/google/update-google-calendar-event"

const calendarRoutes = express.Router()

calendarRoutes.post("/google-calendar/add-calendar-data", assignGoogleCalendarId, validateCreateGoogleEvent, createGoogleCalendarEvent)
calendarRoutes.get("/google-calendar/get-calendar-details", assignGoogleCalendarId, getGoogleCalendarDetails)
calendarRoutes.post(
	"/google-calendar/update-calendar-data",
	assignGoogleCalendarId,
	validateUpdateGoogleCalendarData,
	updateGoogleCalendarEvent
)
calendarRoutes.delete(
	"/google-calendar/delete-calendar-data/:calendarId",
	assignGoogleCalendarId,
	validateCalendarIdInParams,
	deleteGoogleCalendarEvent
)

calendarRoutes.get("/microsoft-calendar/get-calendar-details", assignMicrosoftCalendarId, getMicrosoftCalendarDetails)

calendarRoutes.post("/local-calendar/add-calendar-data", validateAddLocalCalendarData, addLocalCalendarData)
calendarRoutes.get("/local-calendar/get-calendar-data", retrieveAllDbCalendarData)
calendarRoutes.post("/local-calendar/update-calendar-data", validateUpdateLocalCalendarData, updateLocalCalendarData)
calendarRoutes.delete("/local-calendar/delete-calendar-data/:calendarId", validateCalendarIdInParams, deleteLocalCalendarData)

export default calendarRoutes
