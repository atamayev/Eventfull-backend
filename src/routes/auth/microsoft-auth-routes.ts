import express from "express"

import jwtVerify from "../../middleware/jwt/jwt-verify"
import confirmUserHasMicrosoftCalendar from "../../middleware/auth/confirm-user-has-microsoft-calendar"
import validateMicrosoftLoginCallback from "../../middleware/request-validation/auth/microsoft/validate-microsoft-login-callback"
import validateMicrosoftCalendarCallback from "../../middleware/request-validation/auth/microsoft/validate-microsoft-calendar-callback"

import microsoftLoginAuthCallback from "../../controllers/auth/microsoft-auth/microsoft-login-auth-callback"
import microsoftCalendarAuthCallback from "../../controllers/auth/microsoft-auth/microsoft-calendar-auth-callback"
import revokeMicrosoftCalendarAccess from "../../controllers/auth/microsoft-auth/revoke-microsoft-calendar-access"
import generateMicrosoftLoginAuthUrl from "../../controllers/auth/microsoft-auth/generate-microsoft-login-auth-url"
import generateMicrosoftCalendarAuthUrl from "../../controllers/auth/microsoft-auth/generate-microsoft-calendar-auth-url"

const microsoftAuthRoutes = express.Router()

microsoftAuthRoutes.get("/generate-login-auth-url", generateMicrosoftLoginAuthUrl)
microsoftAuthRoutes.get("/generate-calendar-auth-url", jwtVerify, generateMicrosoftCalendarAuthUrl)

microsoftAuthRoutes.post("/login-callback", validateMicrosoftLoginCallback, microsoftLoginAuthCallback)
microsoftAuthRoutes.get("/calendar-callback", validateMicrosoftCalendarCallback, microsoftCalendarAuthCallback)

microsoftAuthRoutes.post("/revoke-microsoft-calendar-access", jwtVerify, confirmUserHasMicrosoftCalendar, revokeMicrosoftCalendarAccess)

export default microsoftAuthRoutes
