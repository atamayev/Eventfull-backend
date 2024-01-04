import express from "express"

import directChatSocialRoutes from "./direct-chat-social-routes"

const chatSocialRoutes = express.Router()

chatSocialRoutes.use("/direct", directChatSocialRoutes)

export default chatSocialRoutes
