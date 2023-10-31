import express from "express"
import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import jwtVerify from "../middleware/jwt-verify"

const calendarRoutes = express.Router()

// calendarRoutes.post("/connect-google-calendar", connectGoogleCalendar)
//Bring back jwtVerify when the google auth flow is synchronized with the local auth flow
calendarRoutes.get("/get-google-calendar-details", getGoogleCalendarDetails)
// calendarRoutes.get("/retrieve-google-calendar-details", jwtVerify, retrieveGoogleCalendarDetails)

export default calendarRoutes
