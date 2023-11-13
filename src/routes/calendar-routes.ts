import express from "express"
import jwtVerify from "../middleware/jwt-verify"

import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import getMicrosoftCalendarDetails from "../controllers/calendar/get-microsoft-calendar-details"
import assignMicrosoftCalendarId from "../middleware/assign-micosoft-calendar-id"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", jwtVerify, getGoogleCalendarDetails)
calendarRoutes.get("/get-microsoft-calendar-details", jwtVerify, assignMicrosoftCalendarId, getMicrosoftCalendarDetails)

export default calendarRoutes
