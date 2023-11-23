import express from "express"

import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/get-microsoft-calendar-details"
import assignMicrosoftCalendarId from "../middleware/calendar/assign-micosoft-calendar-id"
import addLocalCalendarData from "../controllers/calendar/local-calendar/add-local-calendar-data"
import validateAddLocalCalendarDataRequest from "../middleware/request-validation/calendar-routes/validate-add-local-calendar-data-request"
import retrieveAllDbCalendarData from "../controllers/calendar/retrieve-all-db-calendar-data"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", getGoogleCalendarDetails)
calendarRoutes.get("/get-microsoft-calendar-details", assignMicrosoftCalendarId, getMicrosoftCalendarDetails)
calendarRoutes.post("/add-local-calendar-data", validateAddLocalCalendarDataRequest, addLocalCalendarData)
calendarRoutes.get("/get-all-calendar-data", retrieveAllDbCalendarData)

export default calendarRoutes
