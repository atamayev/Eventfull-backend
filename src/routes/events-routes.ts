import express from "express"

import validateResponseToEventfullEventInvite from "../middleware/request-validation/events/validate-response-to-eventfull-event-invite"
import validateEventfullInvite from "../middleware/request-validation/events/validate-eventfull-invite"
import validateCreateEventfullEvent from "../middleware/request-validation/events/validate-create-eventfull-event"
import validateUpdateEventfullEvent from "../middleware/request-validation/events/validate-update-an-eventfull-event"
import validateEventfullEventId from "../middleware/request-validation/events/validate-eventfull-event-id"

import attachEventToRequest from "../middleware/attach-to-request/attach-event-to-request"

import confirmEventIsInviteable from "../middleware/events/confirm-event-is-inviteable"
import confirmEventIsActive from "../middleware/events/confirm-event-is-actve"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"
import confirmUsersAreFriends from "../middleware/social/friend/confirm-users-are-friends"
import confirmEventOrganizerNotBlockingFriend from "../middleware/events/confirm-event-organizer-not-blocking-friend"
import confirmInviterIsAlreadyInvitedOrHost from "../middleware/events/confirm-inviter-is-already-invited-or-host"
import confirmUserIsEventOrganizerOrCohost from "../middleware/events/confirm-user-is-event-organizer-or-cohost"
import confirmInvitedUserHasNotResponded from "../middleware/events/confirm-invited-user-has-not-responded"
import confirmEventIsPublic from "../middleware/events/confirm-event-is-public"
import confirmAbleToInviteFriend from "../middleware/events/confirm-able-to-invite-friend"

import createEventfullEvent from "../controllers/events/create-eventfull-event"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import inviteFriendToEventfullEvent from "../controllers/events/invite-friend-to-eventfull-event"
import retractInviteToEventfullEvent from "../controllers/events/retract-invite-to-eventfull-event"
import deleteEventfullEvent from "../controllers/events/delete-eventfull-event"
import updateEventfullEvent from "../controllers/events/update-eventfull-event"
import pinEventfullEvent from "../controllers/events/pin-eventfull-event"
import removePinnedEventfullEvent from "../controllers/events/remove-pinned-eventfull-event"
import signUpForEventfullEvent from "../controllers/events/sign-up-for-eventfull-event"
import checkIfUserAttendingEventfullEvent from "../middleware/events/check-if-user-attending-eventfull-event"
import cancelEventfullEventRegistration from "../controllers/events/cancel-eventfull-event-registration"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validateCreateEventfullEvent, createEventfullEvent)
eventsRoutes.post(
	"/respond-to-eventfull-invite",
	validateResponseToEventfullEventInvite,
	attachEventToRequest,
	confirmEventOrganizerNotBlockingUser,
	confirmEventIsActive,
	respondToEventfullInvite
)

eventsRoutes.post(
	"/invite-friend-to-eventfull-event",
	validateEventfullInvite,
	attachEventToRequest,
	confirmEventIsInviteable,
	confirmEventIsActive,
	confirmEventOrganizerNotBlockingFriend,
	confirmUsersAreFriends,
	confirmInviterIsAlreadyInvitedOrHost,
	confirmAbleToInviteFriend,
	inviteFriendToEventfullEvent
)

eventsRoutes.post(
	"/retract-invite-to-eventfull-event",
	validateEventfullInvite,
	attachEventToRequest,
	confirmEventIsActive,
	confirmInvitedUserHasNotResponded,
	retractInviteToEventfullEvent
)

eventsRoutes.post(
	"/update-eventfull-event",
	validateUpdateEventfullEvent,
	attachEventToRequest,
	confirmEventIsActive,
	confirmUserIsEventOrganizerOrCohost,
	updateEventfullEvent
)

eventsRoutes.post(
	"/delete-eventfull-event",
	validateEventfullEventId,
	attachEventToRequest,
	confirmUserIsEventOrganizerOrCohost,
	deleteEventfullEvent
)

eventsRoutes.post("/pin-eventfull-event", validateEventfullEventId, attachEventToRequest, confirmEventIsActive, pinEventfullEvent)

eventsRoutes.post("/remove-pinned-eventfull-event", validateEventfullEventId, attachEventToRequest, removePinnedEventfullEvent)

eventsRoutes.post("/sign-up-for-eventfull-event",
	validateEventfullEventId,
	attachEventToRequest,
	confirmEventIsActive,
	confirmEventIsPublic,
	confirmEventOrganizerNotBlockingUser,
	checkIfUserAttendingEventfullEvent,
	signUpForEventfullEvent
)

eventsRoutes.post("/cancel-eventfull-event-registration",
	validateEventfullEventId,
	attachEventToRequest,
	checkIfUserAttendingEventfullEvent,
	cancelEventfullEventRegistration
)

export default eventsRoutes
