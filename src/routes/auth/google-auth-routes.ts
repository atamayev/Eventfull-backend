import express from "express"

import jwtVerify from "../../middleware/jwt/jwt-verify"
import confirmUserHasGoogleCalendar from "../../middleware/auth/confirm-user-has-google-calendar"
import validateGoogleLoginCallback from "../../middleware/request-validation/auth/google/validate-google-login-callback"
import validateGoogleCalendarCallback from "../../middleware/request-validation/auth/google/validate-google-calendar-callback"

import googleLoginAuthCallback from "../../controllers/auth/google-auth/google-login-auth-callback"
import googleCalendarAuthCallback from "../../controllers/auth/google-auth/google-calendar-auth-callback"
import revokeGoogleCalendarAccess from "../../controllers/auth/google-auth/revoke-google-calendar-access"

const googleAuthRoutes = express.Router()

googleAuthRoutes.post("/login-callback", validateGoogleLoginCallback, googleLoginAuthCallback)
googleAuthRoutes.post("/calendar-callback", jwtVerify, validateGoogleCalendarCallback, googleCalendarAuthCallback)
googleAuthRoutes.post("/revoke-google-calendar-access", jwtVerify, confirmUserHasGoogleCalendar, revokeGoogleCalendarAccess)

export default googleAuthRoutes
