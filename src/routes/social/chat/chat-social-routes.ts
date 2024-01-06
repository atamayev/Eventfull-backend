import express from "express"

import groupMessagesRoutes from "./group-messages-routes"
import privateMessagesRoutes from "./private-messages-routes"

const chatSocialRoutes = express.Router()

chatSocialRoutes.use("/private", privateMessagesRoutes)
chatSocialRoutes.use("/group", groupMessagesRoutes)

export default chatSocialRoutes
