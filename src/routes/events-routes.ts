import express from "express"

import validateInviteResponseRequest from "../middleware/request-validation/events/validate-invite-response-request"
import validateEventfullInviteRequest from "../middleware/request-validation/events/validate-eventfull-invite-request"
import validateCreateAnEventfullEventRequest from "../middleware/request-validation/events/validate-create-an-eventfull-event-request"

import isEventInviteable from "../middleware/events/is-event-inviteable"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"
import validateConfirmUsersAreFriends from "../middleware/social/friend/validate-confirm-users-are-friends"
import confirmEventOrganizerNotBlockingFriend from "../middleware/events/confirm-event-organizer-not-blocking-friend"
import confirmInviterIsAlreadyInvitedOrHost from "../middleware/events/confirm-inviter-is-already-invited-or-host"
import confirmFriendNotAlreadyInvited from "../middleware/events/confirm-friend-not-already-invited"

import createAnEventfullEvent from "../controllers/events/create-an-eventfull-event"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import inviteFriendToEventfullEvent from "../controllers/events/invite-friend-to-eventfull-event"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validateCreateAnEventfullEventRequest, createAnEventfullEvent)
eventsRoutes.post(
	"/respond-to-eventfull-invite",
	validateInviteResponseRequest,
	confirmEventOrganizerNotBlockingUser,
	respondToEventfullInvite
)

eventsRoutes.post(
	"/invite-friend-to-eventfull-event",
	validateEventfullInviteRequest,
	isEventInviteable,
	confirmEventOrganizerNotBlockingFriend,
	validateConfirmUsersAreFriends,
	confirmInviterIsAlreadyInvitedOrHost,
	confirmFriendNotAlreadyInvited,
	inviteFriendToEventfullEvent
)

export default eventsRoutes
