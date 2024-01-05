import express from "express"

import directMessagesRoutes from "./direct-messages-routes"
import groupMessagesRoutes from "./group-messages-routes"

const chatSocialRoutes = express.Router()

chatSocialRoutes.use("/direct", directMessagesRoutes)
chatSocialRoutes.use("/group", groupMessagesRoutes)

export default chatSocialRoutes
