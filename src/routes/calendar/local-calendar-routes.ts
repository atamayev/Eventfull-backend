import express from "express"

import validateCalendarId from "../../middleware/request-validation/calendar/validate-calendar-id"
import validateCreateLocalCalendarEvent from "../../middleware/request-validation/calendar/validate-create-local-calendar-event"
import validateUpdateLocalCalendarEvent from "../../middleware/request-validation/calendar/validate-update-local-calendar-event"

import getPinnedEvents from "../../controllers/calendar/get-pinned-events"
import getAllDbCalendarEvents from "../../controllers/calendar/get-all-db-calendar-events"
import addLocalCalendarEvent from "../../controllers/calendar/local-calendar/add-local-calendar-event"
import updateLocalCalendarEvent from "../../controllers/calendar/local-calendar/update-local-calendar-event"
import deleteLocalCalendarEvent from "../../controllers/calendar/local-calendar/delete-local-calendar-event"

const localCalendarRoutes = express.Router()

localCalendarRoutes.post("/create-calendar-event", validateCreateLocalCalendarEvent, addLocalCalendarEvent)

localCalendarRoutes.get("/get-all-calendar-events", getAllDbCalendarEvents)

localCalendarRoutes.post("/update-calendar-event", validateUpdateLocalCalendarEvent, updateLocalCalendarEvent)

localCalendarRoutes.delete("/delete-calendar-event/:calendarId", validateCalendarId, deleteLocalCalendarEvent)

localCalendarRoutes.get("/get-pinned-events", getPinnedEvents)

export default localCalendarRoutes
