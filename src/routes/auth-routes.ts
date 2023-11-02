import express from "express"
import register from "../controllers/auth/register"
import login from "../controllers/auth/login"
import changePassword from "../controllers/auth/change-password"
import googleLoginAuthCallback from "../controllers/auth/google-auth/google-login-auth-callback"
import googleCalendarAuthCallback from "../controllers/auth/google-auth/google-calendar-auth-callback"
import generateGoogleLoginAuthUrl from "../controllers/auth/google-auth/generate-google-login-auth-url"
import generateGoogleCalendarAuthUrl from "../controllers/auth/google-auth/generate-google-calendar-auth-url"

import jwtVerify from "../middleware/jwt-verify"
import validateLoginRequestBody from "../middleware/request-validation/auth-routes/validate-login-request-body"
import validateRegisterRequestBody from "../middleware/request-validation/auth-routes/validate-register-request-body"
import validateGoogleLoginAuthRequest from "../middleware/request-validation/auth-routes/validate-google-login-auth-request"
import validateChangePasswordRequest from "../middleware/request-validation/auth-routes/validate-change-password-request-body"
import validateGoogleCalendarRequest from "../middleware/request-validation/auth-routes/validate-google-calendar-request"
import validateGetGoogleCalendarUrlRequest
	from "../middleware/request-validation/auth-routes/validate-get-google-calendar-url-request-body"

const authRoutes = express.Router()

authRoutes.post("/register", validateRegisterRequestBody, register)
authRoutes.post("/login", validateLoginRequestBody, login)
authRoutes.post("/change-password", jwtVerify, validateChangePasswordRequest, changePassword)

authRoutes.get("/google-auth/generate-login-auth-url", generateGoogleLoginAuthUrl)
authRoutes.get("/google-auth/generate-calendar-auth-url", validateGetGoogleCalendarUrlRequest, generateGoogleCalendarAuthUrl)
authRoutes.get("/google-auth/login-callback", validateGoogleLoginAuthRequest, googleLoginAuthCallback)
authRoutes.get("/google-auth/calendar-callback", validateGoogleCalendarRequest, googleCalendarAuthCallback)

export default authRoutes
