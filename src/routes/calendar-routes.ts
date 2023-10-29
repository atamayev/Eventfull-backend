import express from "express"
import { connectGoogleCalendar, retrieveCalendarDetails } from "../controllers/calendar-controller"

const calendarRoutes = express.Router()

//Add Middleware to verify JWT here, validate the request body
calendarRoutes.post("/connect-google-calendar", connectGoogleCalendar)
calendarRoutes.get("/retrieve-calendar-details", retrieveCalendarDetails)

export default calendarRoutes
