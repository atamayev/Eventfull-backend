import express from "express"
import register from "../controllers/auth/register"
import validateRegisterRequestBody from "../middleware/request-validation/auth-routes/validate-register-request-body"

const authRoutes = express.Router()

authRoutes.post("/register", validateRegisterRequestBody, register)

export default authRoutes
