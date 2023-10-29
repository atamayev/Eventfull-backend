import express from "express"
import register from "../controllers/auth/register"

const authRoutes = express.Router()

authRoutes.post("/register", register)

export default authRoutes
