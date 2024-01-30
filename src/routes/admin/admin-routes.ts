import express from "express"
import adminAuthRoutes from "./auth-routes"
import adminPersonalInfoRoutes from "./personal-info-routes"
import adminJwtVerify from "../../middleware/jwt/admin-jwt-verify"
import adminEventsRoutes from "./events-routes"

const adminRoutes = express.Router()

adminRoutes.use("/auth", adminAuthRoutes)
adminRoutes.use("/personal-info", adminJwtVerify, adminPersonalInfoRoutes)
adminRoutes.use("/events", adminJwtVerify, adminEventsRoutes)

export default adminRoutes
