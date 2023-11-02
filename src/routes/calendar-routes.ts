import express from "express"
import getGoogleCalendarDetails from "../controllers/calendar/get-google-calendar-details"
import jwtVerify from "../middleware/jwt-verify"

const calendarRoutes = express.Router()

calendarRoutes.get("/get-google-calendar-details", jwtVerify,  getGoogleCalendarDetails)

export default calendarRoutes
