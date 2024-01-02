import express from "express"

import localCalendarRoutes from "./local-calendar-routes"
import googleCalendarRoutes from "./google-calendar-routes"
import microsoftCalendarRoutes from "./microsoft-calendar-routes"

const calendarRoutes = express.Router()

calendarRoutes.use("/local-calendar", localCalendarRoutes)
calendarRoutes.use("/google-calendar", googleCalendarRoutes)
calendarRoutes.use("/microsoft-calendar", microsoftCalendarRoutes)

export default calendarRoutes
