import express from "express"
import adminAuthRoutes from "./auth-routes"
import adminPersonalInfoRoutes from "./personal-info-routes"

const adminRoutes = express.Router()

adminRoutes.use("/auth", adminAuthRoutes)
adminRoutes.use("/personal-info", adminPersonalInfoRoutes)

export default adminRoutes
