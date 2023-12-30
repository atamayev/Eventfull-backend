import express from "express"
import validateFriendId from "../middleware/request-validation/social/validate-friend-id"
import validateResponseToFriendRequest from "../middleware/request-validation/social/validate-response-to-friend-request"
import validateBlockedUserId from "../middleware/request-validation/social/validate-blocked-user-id"
import validateUnblockedUserId from "../middleware/request-validation/social/validate-unblocked-user-id"

import checkIfUserBlockedFriend from "../middleware/social/friend/check-if-user-blocked-friend"
import checkIfFriendBlockedUser from "../middleware/social/friend/check-if-friend-blocked-user"
import checkIfUsersAreFriends from "../middleware/social/friend/check-if-users-are-friends"
import checkIfUnblockedUserBlockedUser from "../middleware/social/unblock/check-if-unblocked-user-blocked-user"
import checkIfBlockedUserBlockedUser from "../middleware/social/block/check-if-blocked-user-blocked-user"
import checkIfUserBlockedBlockedUser from "../middleware/social/block/check-if-user-blocked-blocked-user"

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
	validateFriendId,
	checkIfUserBlockedFriend,
	checkIfFriendBlockedUser,
	checkIfUsersAreFriends,
	sendFriendRequest
)
socialRoutes.post(
	"/respond-to-friend-request",
	validateResponseToFriendRequest,
	checkIfUserBlockedFriend,
	checkIfFriendBlockedUser,
	checkIfUsersAreFriends,
	respondToFriendRequest
)
socialRoutes.post("/retract-friend-request", validateFriendId, checkIfUsersAreFriends, retractFriendRequest)
socialRoutes.post("/unfriend-another-user", validateFriendId, unfriendAnotherUser)

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
