import express from "express"

import groupMessagesRoutes from "./group-messages-routes"
import privateMessagesRoutes from "./private-messages-routes"

const chatRoutes = express.Router()

chatRoutes.use("/private", privateMessagesRoutes)
chatRoutes.use("/group", groupMessagesRoutes)

export default chatRoutes
