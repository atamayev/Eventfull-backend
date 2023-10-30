import express from "express"
import register from "../controllers/auth/register"
import login from "../controllers/auth/login"
import validateLoginRequestBody from "../middleware/request-validation/auth-routes/validate-login-request-body"
import changePassword from "../controllers/auth/change-password"
import googleAuthCallback from "../controllers/auth/google-auth/google-auth-callback"
import generateGoogleAuthUrl from "../controllers/auth/google-auth/generate-google-auth-url"

import jwtVerify from "../middleware/jwt-verify"
import validateRegisterRequestBody from "../middleware/request-validation/auth-routes/validate-register-request-body"
import validateGoogleAuthRequest from "../middleware/request-validation/auth-routes/validate-google-auth-request"
import validateChangePasswordRequest from "../middleware/request-validation/auth-routes/validate-change-password-request-body"

const authRoutes = express.Router()

authRoutes.post("/register", validateRegisterRequestBody, register)
authRoutes.post("/login", validateLoginRequestBody, login)
authRoutes.post("/change-password", jwtVerify, validateChangePasswordRequest, changePassword)

authRoutes.get("/google-auth/generate-auth-url", generateGoogleAuthUrl)
authRoutes.get("/google-auth/callback", validateGoogleAuthRequest, googleAuthCallback)

export default authRoutes
