import express from "express"

import directMessagesRoutes from "./direct-messages-routes"

const chatSocialRoutes = express.Router()

chatSocialRoutes.use("/direct", directMessagesRoutes)

export default chatSocialRoutes
