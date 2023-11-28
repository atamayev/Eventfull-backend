import express from "express"
import validateFriendIdInRequest from "../middleware/request-validation/social/validate-friend-id-in-request"
import validateFriendRequestResponse from "../middleware/request-validation/social/validate-friend-request-response"
import validateBlockedUserIdInRequest from "../middleware/request-validation/social/validate-blocked-user-id-in-request"
import validateUnblockedUserIdInRequest from "../middleware/request-validation/social/validate-unblocked-user-id-in-request"

import validateCheckIfUserBlockedFriend from "../middleware/social/friend/validate-check-if-user-blocked-friend"
import validateCheckIfFriendBlockedUser from "../middleware/social/friend/validate-check-if-friend-blocked-user"
import validateCheckIfUsersAreFriends from "../middleware/social/friend/validate-check-if-users-are-friends"
import validateCheckIfUnblockedUserBlockedUser from "../middleware/social/unblock/validate-check-if-unblocked-user-blocked-user"
import validateCheckIfBlockedUserBlockedUser from "../middleware/social/block/validate-check-if-blocked-user-blocked-user"
import validateCheckIfUserBlockedBlockedUser from "../middleware/social/block/validate-check-if-user-blocked-blocked-user"

import sendFriendRequest from "../controllers/social/send-friend-request"
import respondToFriendRequest from "../controllers/social/respond-to-friend-request"
import retractFriendRequest from "../controllers/social/retract-friend-request"
import unfriendAnotherUser from "../controllers/social/unfriend-another-user"
import listIncomingFriendRequests from "../controllers/social/list-incoming-friend-requests"
import listOutgoingFriendRequests from "../controllers/social/list-outgoing-friend-requests"
import blockAnotherUser from "../controllers/social/block-another-user"
import unblockAnotherUser from "../controllers/social/unblock-another-user"
import listBlockedUsers from "../controllers/social/list-blocked-users"

const socialRoutes = express.Router()

socialRoutes.post(
	"/send-friend-request",
	validateFriendIdInRequest,
	validateCheckIfUserBlockedFriend,
	validateCheckIfFriendBlockedUser,
	validateCheckIfUsersAreFriends,
	sendFriendRequest
)
socialRoutes.post(
	"/respond-to-friend-request",
	validateFriendRequestResponse,
	validateCheckIfUserBlockedFriend,
	validateCheckIfFriendBlockedUser,
	validateCheckIfUsersAreFriends,
	respondToFriendRequest
)
socialRoutes.post(
	"/retract-friend-request",
	validateFriendIdInRequest,
	validateCheckIfUsersAreFriends,
	retractFriendRequest
)
socialRoutes.post("/unfriend-another-user", validateFriendIdInRequest, unfriendAnotherUser)

socialRoutes.get("/get-incoming-friend-requests", listIncomingFriendRequests)
socialRoutes.get("/get-outgoing-friend-requests", listOutgoingFriendRequests)
socialRoutes.get("/get-blocked-users", listBlockedUsers)

socialRoutes.post(
	"/block-another-user",
	validateBlockedUserIdInRequest,
	validateCheckIfUserBlockedBlockedUser,
	validateCheckIfBlockedUserBlockedUser,
	blockAnotherUser
)
socialRoutes.post(
	"/unblock-another-user",
	validateUnblockedUserIdInRequest,
	validateCheckIfUnblockedUserBlockedUser,
	unblockAnotherUser
)

export default socialRoutes
