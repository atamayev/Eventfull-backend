import express from "express"

import groupMessagesRoutes from "./group-messages-routes"
import directMessagesRoutes from "./direct-messages-routes"

const chatSocialRoutes = express.Router()

chatSocialRoutes.use("/direct", directMessagesRoutes)
chatSocialRoutes.use("/group", groupMessagesRoutes)

export default chatSocialRoutes
