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
import microsoftLoginAuthCallback from "../controllers/auth/microsoft-auth/microsoft-login-auth-callback"
import microsoftCalendarAuthCallback from "../controllers/auth/microsoft-auth/microsoft-calendar-auth-callback"
import checkIfUsernameExists from "../controllers/auth/check-if-username-exists"
import checkIfContactExists from "../controllers/auth/check-if-contact-exists"
import addCloudUserPersonalInfo from "../controllers/auth/add-cloud-user-personal-info"
import addSecondaryContactMethod from "../controllers/auth/add-secondary-contact-method"
import revokeGoogleCalendarAccess from "../controllers/auth/google-auth/revoke-google-calendar-access"

import jwtVerify from "../middleware/jwt-verify"
import validateLogin from "../middleware/request-validation/auth/validate-login"
import validateRegister from "../middleware/request-validation/auth/validate-register"
import validateQueryCode from "../middleware/request-validation/auth/validate-query-code"
import validateChangePassword from "../middleware/request-validation/auth/validate-change-password"
import validateCalendarCallback from "../middleware/request-validation/auth/validate-calendar-callback"
import validateUsernameInBody from "../middleware/request-validation/auth/validate-username-in-body"
import validateContact from "../middleware/request-validation/auth/validate-contact"
import determineBodyContactType from "../middleware/auth/determine-contact-type/determine-body-contact-type"
import determineRegisterContactType	from "../middleware/auth/determine-contact-type/determine-register-contact-type"
import determineChangePasswordContactType from "../middleware/auth/determine-contact-type/determine-change-password-contact-type"
import validateAddCloudUserPersonalInfo from "../middleware/request-validation/auth/validate-add-cloud-user-personal-info"
import confirmUserHasGoogleCalendar from "../middleware/auth/confirm-user-has-google-calendar"

const authRoutes = express.Router()

authRoutes.post("/login", validateLogin, login)
authRoutes.post("/register", validateRegister, determineRegisterContactType, register)
authRoutes.post("/change-password", jwtVerify, validateChangePassword, determineChangePasswordContactType, changePassword)
authRoutes.post("/does-username-exist", jwtVerify, validateUsernameInBody, checkIfUsernameExists)
authRoutes.post("/check-if-contact-exists", jwtVerify, validateContact,
	determineBodyContactType, checkIfContactExists)

authRoutes.get("/google-auth/generate-login-auth-url", generateGoogleLoginAuthUrl)
authRoutes.get("/google-auth/generate-calendar-auth-url", jwtVerify, generateGoogleCalendarAuthUrl)

authRoutes.get("/google-auth/login-callback", validateQueryCode, googleLoginAuthCallback)
authRoutes.get("/google-auth/calendar-callback", validateCalendarCallback, googleCalendarAuthCallback)

authRoutes.post("/google-auth/revoke-google-calendar-access", jwtVerify, confirmUserHasGoogleCalendar, revokeGoogleCalendarAccess)

authRoutes.get("/microsoft-auth/generate-login-auth-url", generateMicrosoftLoginAuthUrl)
authRoutes.get("/microsoft-auth/generate-calendar-auth-url", jwtVerify, generateMicrosoftCalendarAuthUrl)

authRoutes.get("/microsoft-auth/login-callback", validateQueryCode, microsoftLoginAuthCallback)
authRoutes.get("/microsoft-auth/calendar-callback", validateCalendarCallback, microsoftCalendarAuthCallback)

authRoutes.post("/add-cloud-user-personal-info", jwtVerify, validateAddCloudUserPersonalInfo, addCloudUserPersonalInfo)
authRoutes.post("/add-secondary-contact", jwtVerify, validateContact,
	determineBodyContactType, addSecondaryContactMethod)

export default authRoutes
