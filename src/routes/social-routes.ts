import express from "express"

import validateFriendId from "../middleware/request-validation/social/validate-friend-id"
import validateBlockedUserId from "../middleware/request-validation/social/validate-blocked-user-id"
import validateUnblockedUserId from "../middleware/request-validation/social/validate-unblocked-user-id"
import validateResponseToFriendRequest from "../middleware/request-validation/social/validate-response-to-friend-request"

import confirmUsersAreFriends from "../middleware/social/friend/confirm-users-are-friends"
import confirmUsersAreNotFriends from "../middleware/social/friend/confirm-users-are-not-friends"
import confirmUserHasntBlockedFriend from "../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import checkIfBlockedUserBlockedUser from "../middleware/social/block/check-if-blocked-user-blocked-user"
import checkIfUserBlockedBlockedUser from "../middleware/social/block/check-if-user-blocked-blocked-user"
import checkIfUnblockedUserBlockedUser from "../middleware/social/unblock/check-if-unblocked-user-blocked-user"

import blockAnotherUser from "../controllers/social/block-another-user"
import listBlockedUsers from "../controllers/social/list-blocked-users"
import sendFriendRequest from "../controllers/social/send-friend-request"
import unblockAnotherUser from "../controllers/social/unblock-another-user"
import unfriendAnotherUser from "../controllers/social/unfriend-another-user"
import retractFriendRequest from "../controllers/social/retract-friend-request"
import respondToFriendRequest from "../controllers/social/respond-to-friend-request"
import listIncomingFriendRequests from "../controllers/social/list-incoming-friend-requests"
import listOutgoingFriendRequests from "../controllers/social/list-outgoing-friend-requests"

const socialRoutes = express.Router()

socialRoutes.post(
	"/send-friend-request",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreNotFriends,
	sendFriendRequest
)

socialRoutes.post(
	"/respond-to-friend-request",
	validateResponseToFriendRequest,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreNotFriends,
	respondToFriendRequest
)

socialRoutes.post("/retract-friend-request", validateFriendId, confirmUsersAreNotFriends, retractFriendRequest)
socialRoutes.post("/unfriend-another-user", validateFriendId, confirmUsersAreFriends, unfriendAnotherUser)

socialRoutes.get("/get-incoming-friend-requests", listIncomingFriendRequests)
socialRoutes.get("/get-outgoing-friend-requests", listOutgoingFriendRequests)
socialRoutes.get("/get-blocked-users", listBlockedUsers)

socialRoutes.post(
	"/block-another-user",
	validateBlockedUserId,
	checkIfUserBlockedBlockedUser,
	checkIfBlockedUserBlockedUser,
	blockAnotherUser
)

socialRoutes.post("/unblock-another-user", validateUnblockedUserId, checkIfUnblockedUserBlockedUser, unblockAnotherUser)

export default socialRoutes
