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

import jwtVerify from "../middleware/jwt-verify"
import validateLoginRequest from "../middleware/request-validation/auth-routes/validate-login-request"
import validateRegisterRequest from "../middleware/request-validation/auth-routes/validate-register-request"
import validateQueryCode from "../middleware/request-validation/auth-routes/validate-query-code"
import validateChangePasswordRequest from "../middleware/request-validation/auth-routes/validate-change-password-request"
import validateGoogleCalendarRequest from "../middleware/request-validation/auth-routes/validate-calendar-callback-request"
import validateAuthorizationHeader from "../middleware/request-validation/auth-routes/validate-authorization-header"
import validateCheckIfUsernameExistsRequest from "../middleware/request-validation/auth-routes/validate-check-if-username-exists-request"
import validateCheckIfContactExistsRequest
	from "../middleware/request-validation/auth-routes/validate-check-if-contact-exists-request"
import determineBodyContactType from "../middleware/request-validation/auth-routes/determine-contact-type/determine-body-contact-type"
import determineLoginContactType from "../middleware/request-validation/auth-routes/determine-contact-type/determine-login-contact-type"
import determineRegisterContactType
	from "../middleware/request-validation/auth-routes/determine-contact-type/determine-register-contact-type"
import determineChangePasswordContactType
	from "../middleware/request-validation/auth-routes/determine-contact-type/determine-change-password-contact-type"
import validateAddCloudUserPersonalInfoRequest
	from "../middleware/request-validation/auth-routes/validate-add-cloud-user-personal-info-request"

const authRoutes = express.Router()

authRoutes.post("/login", validateLoginRequest, determineLoginContactType, login)
authRoutes.post("/register", validateRegisterRequest, determineRegisterContactType, register)
authRoutes.post("/change-password", jwtVerify, validateChangePasswordRequest, determineChangePasswordContactType, changePassword)
authRoutes.post("/does-username-exist", jwtVerify, validateCheckIfUsernameExistsRequest, checkIfUsernameExists)
authRoutes.post("/check-if-email-or-phone-exists", jwtVerify, validateCheckIfContactExistsRequest,
	determineBodyContactType, checkIfContactExists)

authRoutes.get("/google-auth/generate-login-auth-url", generateGoogleLoginAuthUrl)
authRoutes.get("/google-auth/generate-calendar-auth-url", validateAuthorizationHeader, generateGoogleCalendarAuthUrl)

authRoutes.get("/google-auth/login-callback", validateQueryCode, googleLoginAuthCallback)
authRoutes.get("/google-auth/calendar-callback", validateGoogleCalendarRequest, googleCalendarAuthCallback)

authRoutes.get("/microsoft-auth/generate-login-auth-url", generateMicrosoftLoginAuthUrl)
authRoutes.get("/microsoft-auth/generate-calendar-auth-url", validateAuthorizationHeader, generateMicrosoftCalendarAuthUrl)

authRoutes.get("/microsoft-auth/login-callback", validateQueryCode, microsoftLoginAuthCallback)
authRoutes.get("/microsoft-auth/calendar-callback", validateGoogleCalendarRequest, microsoftCalendarAuthCallback)

authRoutes.post("/add-cloud-user-personal-info", jwtVerify, validateAddCloudUserPersonalInfoRequest, addCloudUserPersonalInfo)

export default authRoutes
