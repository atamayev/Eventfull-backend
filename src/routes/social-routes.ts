import express from "express"
import validateFriendIdInRequest from "../middleware/request-validation/social-routes.ts/validate-friend-id-in-request"
import validateFriendRequestResponse from "../middleware/request-validation/social-routes.ts/validate-friend-request-response"
import validateBlockedUserIdInRequest from "../middleware/request-validation/social-routes.ts/validate-blocked-user-id-in-request"
import validateUnblockedUserIdInRequest from "../middleware/request-validation/social-routes.ts/validate-unblocked-user-id-in-request"

import sendFriendRequest from "../controllers/social/send-friend-request"
import respondToFriendRequest from "../controllers/social/respond-to-friend-request"
import retractFriendRequest from "../controllers/social/retract-friend-request"
import unfriendAnotherUser from "../controllers/social/unfriend-another-user"
import getIncomingFriendRequests from "../controllers/social/get-incoming-friend-requests"
import getOutgoingFriendRequests from "../controllers/social/get-outgoing-friend-requests"
import blockAnotherUser from "../controllers/social/block-another-user"
import unblockAnotherUser from "../controllers/social/unblock-another-user"

const socialRoutes = express.Router()

socialRoutes.post("/send-friend-request", validateFriendIdInRequest, sendFriendRequest)
socialRoutes.post("/respond-to-friend-request", validateFriendRequestResponse, respondToFriendRequest)
socialRoutes.post("/retract-friend-request", validateFriendIdInRequest, retractFriendRequest)
socialRoutes.post("/unfriend-another-user", validateFriendIdInRequest, unfriendAnotherUser)

socialRoutes.get("/get-incoming-friend-requests", getIncomingFriendRequests)
socialRoutes.get("/get-outgoing-friend-requests", getOutgoingFriendRequests)

socialRoutes.post("/block-another-user", validateBlockedUserIdInRequest, blockAnotherUser)
socialRoutes.post("/unblock-another-user", validateUnblockedUserIdInRequest, unblockAnotherUser)

export default socialRoutes
