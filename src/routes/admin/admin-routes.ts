import express from "express"
import adminAuthRoutes from "./auth-routes"
import adminEventsRoutes from "./events-routes"
import adminUsersRoutes from "../users/users-routes"
import adminPersonalInfoRoutes from "./personal-info-routes"

import adminJwtVerify from "../../middleware/jwt/admin-jwt-verify"

const adminRoutes = express.Router()

adminRoutes.use("/auth", adminAuthRoutes)
adminRoutes.use("/personal-info", adminJwtVerify, adminPersonalInfoRoutes)
adminRoutes.use("/events", adminJwtVerify, adminEventsRoutes)
adminRoutes.use("/users", adminJwtVerify, adminUsersRoutes)

export default adminRoutes
