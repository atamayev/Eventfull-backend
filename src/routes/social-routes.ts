import express from "express"
import sendFriendRequest from "../controllers/social/send-friend-request"
import validateFriendIdInRequest from "../middleware/request-validation/social-routes.ts/validate-friend-id-in-request"

const socialRoutes = express.Router()

socialRoutes.post("/send-friend-request", validateFriendIdInRequest, sendFriendRequest)

export default socialRoutes
