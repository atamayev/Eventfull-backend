import express from "express"
import createAnEventfullEvent from "../controllers/events/create-an-eventfull-event"
import validateCreateAnEventfullEventRequest from "../middleware/request-validation/events/validate-create-an-eventfull-event-request"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import validateInviteResponseRequest from "../middleware/request-validation/events/validate-invite-response-request"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validateCreateAnEventfullEventRequest, createAnEventfullEvent)
eventsRoutes.post(
	"/respond-to-eventfull-invite",
	validateInviteResponseRequest,
	confirmEventOrganizerNotBlockingUser,
	respondToEventfullInvite
)

export default eventsRoutes
