import express from "express"

import validateInviteResponseRequest from "../middleware/request-validation/events/validate-invite-response-request"
import validateEventfullInviteRequest from "../middleware/request-validation/events/validate-eventfull-invite-request"
import validateCreateEventfullEvent from "../middleware/request-validation/events/validate-create-eventfull-event"
import validateUpdateEventfullEvent from "../middleware/request-validation/events/validate-update-an-eventfull-event"
import validateEventfullEventId from "../middleware/request-validation/events/validate-eventfull-event-id"

import isEventInviteable from "../middleware/events/is-event-inviteable"
import confirmEventIsActive from "../middleware/events/confirm-event-is-actve"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"
import validateConfirmUsersAreFriends from "../middleware/social/friend/validate-confirm-users-are-friends"
import confirmEventOrganizerNotBlockingFriend from "../middleware/events/confirm-event-organizer-not-blocking-friend"
import confirmInviterIsAlreadyInvitedOrHost from "../middleware/events/confirm-inviter-is-already-invited-or-host"
import confirmFriendNotAlreadyInvited from "../middleware/events/confirm-friend-not-already-invited"
import confirmUserIsEventOrganizerOrCohost from "../middleware/events/confirm-user-is-event-organizer-or-cohost"
import confirmInvitedUserHasNotResponded from "../middleware/events/confirm-invited-user-has-not-responded"
import confirmEventIsPublic from "../middleware/events/confirm-event-is-public"
import confirmFriendNotAlreadyAttending from "../middleware/events/confirm-friend-not-already-attending"

import createEventfullEvent from "../controllers/events/create-eventfull-event"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import inviteFriendToEventfullEvent from "../controllers/events/invite-friend-to-eventfull-event"
import retractInviteToEventfullEvent from "../controllers/events/retract-invite-to-eventfull-event"
import deleteEventfullEvent from "../controllers/events/delete-eventfull-event"
import updateEventfullEvent from "../controllers/events/update-eventfull-event"
import pinEventfullEvent from "../controllers/events/pin-eventfull-event"
import removePinnedEventfullEvent from "../controllers/events/remove-pinned-eventfull-event"
import signUpForEventfullEvent from "../controllers/events/sign-up-for-eventfull-event"
import confirmUserNotAlreadyAttending from "../middleware/events/confirm-user-not-already-attending"

const eventsRoutes = express.Router()

eventsRoutes.post("/create-eventfull-event", validateCreateEventfullEvent, createEventfullEvent)
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
	confirmFriendNotAlreadyAttending,
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
	"/update-eventfull-event",
	validateUpdateEventfullEvent,
	confirmEventIsActive,
	confirmUserIsEventOrganizerOrCohost,
	updateEventfullEvent
)

eventsRoutes.post(
	"/delete-eventfull-event",
	validateEventfullEventId,
	confirmUserIsEventOrganizerOrCohost,
	deleteEventfullEvent
)

eventsRoutes.post("/pin-eventfull-event", validateEventfullEventId, confirmEventIsActive, pinEventfullEvent)

eventsRoutes.post("/remove-pinned-eventfull-event", validateEventfullEventId, removePinnedEventfullEvent)

eventsRoutes.post("/sign-up-for-eventfull-event",
	validateEventfullEventId,
	confirmEventIsActive,
	confirmEventIsPublic,
	confirmEventOrganizerNotBlockingUser,
	confirmUserNotAlreadyAttending,
	signUpForEventfullEvent
)

export default eventsRoutes
