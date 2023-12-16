import express from "express"

import validateInviteResponseRequest from "../middleware/request-validation/events/validate-invite-response-request"
import validateEventfullInviteRequest from "../middleware/request-validation/events/validate-eventfull-invite-request"
import validatecreateEventfullEventRequest from "../middleware/request-validation/events/validate-create-an-eventfull-event-request"

import isEventInviteable from "../middleware/events/is-event-inviteable"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"
import validateConfirmUsersAreFriends from "../middleware/social/friend/validate-confirm-users-are-friends"
import confirmEventOrganizerNotBlockingFriend from "../middleware/events/confirm-event-organizer-not-blocking-friend"
import confirmInviterIsAlreadyInvitedOrHost from "../middleware/events/confirm-inviter-is-already-invited-or-host"
import confirmFriendNotAlreadyInvited from "../middleware/events/confirm-friend-not-already-invited"

import createEventfullEvent from "../controllers/events/create-eventfull-event"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import inviteFriendToEventfullEvent from "../controllers/events/invite-friend-to-eventfull-event"
import retractInviteToEventfullEvent from "../controllers/events/retract-invite-to-eventfull-event"
import confirmInvitedUserHasNotResponded from "../middleware/events/confirm-invited-user-has-not-responded"
import confirmEventIsActive from "../middleware/events/confirm-event-is-actve"
import deleteEventfullEvent from "../controllers/events/delete-eventfull-event"
import validateDeleteEventfullEvent from "../middleware/request-validation/events/validate-delete-eventfull-event"
import confirmUserIsEventOrganizer from "../middleware/events/confirm-user-is-event-organizer"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validatecreateEventfullEventRequest, createEventfullEvent)
eventsRoutes.post(
	"/respond-to-eventfull-invite",
	validateInviteResponseRequest,
	confirmEventOrganizerNotBlockingUser,
	confirmEventIsActive,
	respondToEventfullInvite
)

eventsRoutes.post(
	"/invite-friend-to-eventfull-event",
	validateEventfullInviteRequest,
	isEventInviteable,
	confirmEventIsActive,
	confirmEventOrganizerNotBlockingFriend,
	validateConfirmUsersAreFriends,
	confirmInviterIsAlreadyInvitedOrHost,
	confirmFriendNotAlreadyInvited,
	inviteFriendToEventfullEvent
)

eventsRoutes.post(
	"/retract-invite-to-eventfull-event",
	validateEventfullInviteRequest,
	confirmEventIsActive,
	confirmInvitedUserHasNotResponded,
	retractInviteToEventfullEvent
)

eventsRoutes.post(
	"/delete-eventfull-event",
	validateDeleteEventfullEvent,
	confirmUserIsEventOrganizer,
	deleteEventfullEvent
)

export default eventsRoutes
