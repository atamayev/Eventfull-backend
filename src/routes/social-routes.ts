import express from "express"
import validateFriendIdInRequest from "../middleware/request-validation/social-routes.ts/validate-friend-id-in-request"
import validateFriendRequestResponse from "../middleware/request-validation/social-routes.ts/validate-friend-request-response"

import sendFriendRequest from "../controllers/social/send-friend-request"
import respondToFriendRequest from "../controllers/social/respond-to-friend-request"
import retractFriendRequest from "../controllers/social/retract-friend-request"
import unfriendAnotherUser from "../controllers/social/unfriend-another-user"

const socialRoutes = express.Router()

socialRoutes.post("/send-friend-request", validateFriendIdInRequest, sendFriendRequest)
socialRoutes.post("/respond-to-friend-request", validateFriendRequestResponse, respondToFriendRequest)
socialRoutes.post("/retract-friend-request", validateFriendIdInRequest, retractFriendRequest)
socialRoutes.post("/unfriend-another-user", validateFriendIdInRequest, unfriendAnotherUser)

export default socialRoutes
