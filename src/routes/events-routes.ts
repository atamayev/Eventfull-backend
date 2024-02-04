import express from "express"

import validateEventfullInvite from "../middleware/request-validation/events/validate-eventfull-invite"
import validateEventfullEventId from "../middleware/request-validation/events/validate-eventfull-event-id"
import validateUpdateEventfullEvent from "../middleware/request-validation/events/validate-update-eventfull-event"
import validateCreateEventfullEvent from "../middleware/request-validation/events/validate-create-eventfull-event"
import validateResponseToEventfullEventInvite from "../middleware/request-validation/events/validate-response-to-eventfull-event-invite"

import attachEventToRequest from "../middleware/attach-to-request/attach-event-to-request"
import attachEventOrganizerToRequest from "../middleware/attach-to-request/attach-event-organizer-to-request"

import confirmEventIsActive from "../middleware/events/confirm-event-is-actve"
import confirmEventIsPublic from "../middleware/events/confirm-event-is-public"
import confirmEventIsPinned from "../middleware/events/confirm-event-is-pinned"
import confirmEventIsNotPinned from "../middleware/events/confirm-event-is-not-pinned"
import confirmEventIsInviteable from "../middleware/events/confirm-event-is-inviteable"
import checkIfEventCapacityFull from "../middleware/events/check-if-event-capacity-full"
import confirmUsersAreFriends from "../middleware/social/friend/confirm-users-are-friends"
import confirmAbleToInviteFriend from "../middleware/events/confirm-able-to-invite-friend"
import confirmNotInvitingThemselves from "../middleware/events/confirm-not-inviting-themselves"
import confirmEventFrequencyAttributes from "../middleware/events/confirm-event-frequency-attributes"
import confirmInvitedUserHasNotResponded from "../middleware/events/confirm-invited-user-has-not-responded"
import checkIfUserAttendingEventfullEvent from "../middleware/events/check-if-user-attending-eventfull-event"
import confirmUserIsEventOrganizerOrCohost from "../middleware/events/confirm-user-is-event-organizer-or-cohost"
import confirmEventOrganizerNotBlockingUser from "../middleware/events/confirm-event-organizer-not-blocking-user"
import confirmUserNotBlockingEventOrganizer from "../middleware/events/confirm-user-not-blocking-event-organizer"
import confirmInviterIsAlreadyInvitedOrHost from "../middleware/events/confirm-inviter-is-already-invited-or-host"
import confirmEventOrganizerNotBlockingFriend from "../middleware/events/confirm-event-organizer-not-blocking-friend"

import pinEventfullEvent from "../controllers/events/pin-eventfull-event"
import createEventfullEvent from "../controllers/events/create-eventfull-event"
import deleteEventfullEvent from "../controllers/events/delete-eventfull-event"
import updateEventfullEvent from "../controllers/events/update-eventfull-event"
import signUpForEventfullEvent from "../controllers/events/sign-up-for-eventfull-event"
import respondToEventfullInvite from "../controllers/events/respond-to-eventfull-invite"
import removePinnedEventfullEvent from "../controllers/events/remove-pinned-eventfull-event"
import inviteFriendToEventfullEvent from "../controllers/events/invite-friend-to-eventfull-event"
import retractInviteToEventfullEvent from "../controllers/events/retract-invite-to-eventfull-event"
import cancelEventfullEventRegistration from "../controllers/events/cancel-eventfull-event-registration"

const eventsRoutes = express.Router()

eventsRoutes.post(
	"/create-eventfull-event",
	validateCreateEventfullEvent,
	confirmEventFrequencyAttributes,
	createEventfullEvent
)

eventsRoutes.post(
	"/respond-to-eventfull-invite",
	validateResponseToEventfullEventInvite,
	attachEventToRequest,
	checkIfEventCapacityFull,
	attachEventOrganizerToRequest,
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
	attachEventOrganizerToRequest,
	confirmEventOrganizerNotBlockingFriend,
	confirmNotInvitingThemselves,
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

// TODO: Move the eventufllevent id to be a param, like in the messages routes
eventsRoutes.post("/delete-eventfull-event/:eventfullEventId",
	validateEventfullEventId,
	confirmEventIsActive,
	confirmUserIsEventOrganizerOrCohost,
	deleteEventfullEvent
)

eventsRoutes.post(
	"/pin-eventfull-event/:eventfullEventId",
	validateEventfullEventId,
	confirmEventIsActive,
	confirmEventIsNotPinned,
	pinEventfullEvent
)

eventsRoutes.post(
	"/remove-pinned-eventfull-event/:eventfullEventId",
	validateEventfullEventId,
	confirmEventIsPinned,
	removePinnedEventfullEvent
)

eventsRoutes.post("/sign-up-for-eventfull-event/:eventfullEventId",
	validateEventfullEventId,
	confirmEventIsActive,
	confirmEventIsPublic,
	checkIfEventCapacityFull,
	attachEventOrganizerToRequest,
	confirmUserNotBlockingEventOrganizer,
	confirmEventOrganizerNotBlockingUser,
	checkIfUserAttendingEventfullEvent,
	signUpForEventfullEvent
)

eventsRoutes.post("/cancel-eventfull-event-registration/:eventfullEventId",
	validateEventfullEventId,
	checkIfUserAttendingEventfullEvent,
	cancelEventfullEventRegistration
)

export default eventsRoutes
