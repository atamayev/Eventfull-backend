import express from "express"
import register from "../controllers/auth/register"
import login from "../controllers/auth/login"
import changePassword from "../controllers/auth/change-password"
import googleLoginAuthCallback from "../controllers/auth/google-auth/google-login-auth-callback"
import googleCalendarAuthCallback from "../controllers/auth/google-auth/google-calendar-auth-callback"
import generateGoogleLoginAuthUrl from "../controllers/auth/google-auth/generate-google-login-auth-url"
import generateGoogleCalendarAuthUrl from "../controllers/auth/google-auth/generate-google-calendar-auth-url"
import generateMicrosoftLoginAuthUrl from "../controllers/auth/microsoft-auth/generate-microsoft-login-auth-url"
import generateMicrosoftCalendarAuthUrl from "../controllers/auth/microsoft-auth/generate-microsoft-calendar-auth-url"

import jwtVerify from "../middleware/jwt-verify"
import validateLoginRequestBody from "../middleware/request-validation/auth-routes/validate-login-request-body"
import validateRegisterRequestBody from "../middleware/request-validation/auth-routes/validate-register-request-body"
import validateGoogleAndMicrosoftLoginAuthRequest
	from "../middleware/request-validation/auth-routes/validate-google-and-microsoft-login-auth-request"
import validateChangePasswordRequest from "../middleware/request-validation/auth-routes/validate-change-password-request-body"
import validateGoogleCalendarRequest from "../middleware/request-validation/auth-routes/validate-google-calendar-request"
import validateGetGoogleAndMicrosoftCalendarUrlRequest
	from "../middleware/request-validation/auth-routes/validate-get-google-and-microsoft-calendar-url-request-body"

const authRoutes = express.Router()

authRoutes.post("/register", validateRegisterRequestBody, register)
authRoutes.post("/login", validateLoginRequestBody, login)
authRoutes.post("/change-password", jwtVerify, validateChangePasswordRequest, changePassword)

authRoutes.get("/google-auth/generate-login-auth-url", generateGoogleLoginAuthUrl)
authRoutes.get("/google-auth/generate-calendar-auth-url", validateGetGoogleAndMicrosoftCalendarUrlRequest, generateGoogleCalendarAuthUrl)

authRoutes.get("/google-auth/login-callback", validateGoogleAndMicrosoftLoginAuthRequest, googleLoginAuthCallback)
authRoutes.get("/google-auth/calendar-callback", validateGoogleCalendarRequest, googleCalendarAuthCallback)

authRoutes.get("/microsoft-auth/generate-login-auth-url", generateMicrosoftLoginAuthUrl)
authRoutes.get("/microsoft-auth/generate-calendar-auth-url", validateGetGoogleAndMicrosoftCalendarUrlRequest,
	generateMicrosoftCalendarAuthUrl)

authRoutes.get("/microsoft-auth/login-callback", validateGoogleAndMicrosoftLoginAuthRequest, googleLoginAuthCallback)
// authRoutes.get("/microsoft-auth/calendar-callback", validateGoogleCalendarRequest, googleCalendarAuthCallback)

export default authRoutes
