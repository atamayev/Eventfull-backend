import express from "express"
import createAnEventfullEvent from "../controllers/events/create-an-eventfull-event"
import validateCreateAnEventfullEventRequest from "../middleware/request-validation/events/validate-create-an-eventfull-event-request"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validateCreateAnEventfullEventRequest, createAnEventfullEvent)

export default eventsRoutes
