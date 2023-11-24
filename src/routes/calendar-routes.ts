import express from "express"

import assignMicrosoftCalendarId from "../middleware/calendar/assign-micosoft-calendar-id"
import validateAddLocalCalendarData from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-data-request"
import validateUpdateLocalCalendarData from "../middleware/request-validation/calendar-routes/validate-update-local-calendar-data-request"
import validateCalendarIdInParams from "../middleware/request-validation/calendar-routes/validate-calendarId-in-params"
import validateCreateGoogleEvent from "../middleware/request-validation/calendar-routes/validate-create-google-event"

import getGoogleCalendarDetails from "../controllers/calendar/google/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/microsoft/get-microsoft-calendar-details"
import addLocalCalendarData from "../controllers/calendar/local-calendar/add-local-calendar-data"
import retrieveAllDbCalendarData from "../controllers/calendar/retrieve-all-db-calendar-data"
import updateLocalCalendarData from "../controllers/calendar/local-calendar/update-local-calendar-data"
import deleteLocalCalendarData from "../controllers/calendar/local-calendar/delete-local-calendar-data"
import createGoogleCalendarEvent from "../controllers/calendar/google/create-google-calendar-event"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", getGoogleCalendarDetails)
calendarRoutes.post("/add-google-calendar-data", validateCreateGoogleEvent, createGoogleCalendarEvent)

calendarRoutes.get("/get-microsoft-calendar-details", assignMicrosoftCalendarId, getMicrosoftCalendarDetails)

calendarRoutes.post("/add-local-calendar-data", validateAddLocalCalendarData, addLocalCalendarData)
calendarRoutes.get("/get-all-calendar-data", retrieveAllDbCalendarData)
calendarRoutes.post("/update-local-calendar-data", validateUpdateLocalCalendarData, updateLocalCalendarData)
calendarRoutes.delete("/delete-local-calendar-data/:calendarId", validateCalendarIdInParams, deleteLocalCalendarData)

export default calendarRoutes
