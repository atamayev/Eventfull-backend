import express from "express"
import register from "../controllers/auth/register"
import login from "../controllers/auth/login"
import validateRegisterRequestBody from "../middleware/request-validation/auth-routes/validate-register-request-body"
import validateLoginRequestBody from "../middleware/request-validation/auth-routes/validate-login-request-body"
import changePassword from "../controllers/auth/change-password"
import jwtVerify from "../middleware/jwt-verify"
import validateChangePasswordRequest from "../middleware/request-validation/auth-routes/validate-change-password-request-body"

const authRoutes = express.Router()

authRoutes.post("/register", validateRegisterRequestBody, register)
authRoutes.post("/login", validateLoginRequestBody, login)
authRoutes.post("/change-password", jwtVerify, validateChangePasswordRequest, changePassword)

export default authRoutes
