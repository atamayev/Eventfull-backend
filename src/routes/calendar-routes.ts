import express from "express"

import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/get-microsoft-calendar-details"
import assignMicrosoftCalendarId from "../middleware/calendar/assign-micosoft-calendar-id"
import addLocalCalendarData from "../controllers/calendar/local-calendar/add-local-calendar-data"
import validateAddLocalCalendarDataRequest from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-data-request"
import retrieveAllDbCalendarData from "../controllers/calendar/retrieve-all-db-calendar-data"
import updateLocalCalendarData from "../controllers/calendar/local-calendar/update-local-calendar-data"
import validateUpdateLocalCalendarDataRequest
	from "../middleware/request-validation/calendar-routes/validate-update-local-calendar-data-request"
import deleteLocalCalendarData from "../controllers/calendar/local-calendar/delete-local-calendar-data"
import validateCalendarIdInParams from "../middleware/request-validation/calendar-routes/validate-calendarId-in-params"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", getGoogleCalendarDetails)
calendarRoutes.get("/get-microsoft-calendar-details", assignMicrosoftCalendarId, getMicrosoftCalendarDetails)
calendarRoutes.post("/add-local-calendar-data", validateAddLocalCalendarDataRequest, addLocalCalendarData)
calendarRoutes.get("/get-all-calendar-data", retrieveAllDbCalendarData)
calendarRoutes.post("/update-local-calendar-data", validateUpdateLocalCalendarDataRequest, updateLocalCalendarData)
calendarRoutes.delete("/delete-local-calendar-data/:calendarId", validateCalendarIdInParams, deleteLocalCalendarData)

export default calendarRoutes
