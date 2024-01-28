import express from "express"
import adminAuthRoutes from "./auth-routes"

const adminRoutes = express.Router()

adminRoutes.use("/auth", adminAuthRoutes)

export default adminRoutes
