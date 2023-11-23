import express from "express"

import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/get-microsoft-calendar-details"
import assignMicrosoftCalendarId from "../middleware/calendar/assign-micosoft-calendar-id"
import addLocalCalendarData from "../controllers/calendar/add-local-calendar-data"
import validateAddLocalCalendarDataRequest from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-data-request"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", getGoogleCalendarDetails)
calendarRoutes.get("/get-microsoft-calendar-details", assignMicrosoftCalendarId, getMicrosoftCalendarDetails)
calendarRoutes.get("/add-local-calendar-data", validateAddLocalCalendarDataRequest, addLocalCalendarData)

export default calendarRoutes
