import express from "express"

import register from "../controllers/auth/register"
import login from "../controllers/auth/login"
import logout from "../controllers/auth/logout"
import changePassword from "../controllers/auth/change-password"
import googleLoginAuthCallback from "../controllers/auth/google-auth/google-login-auth-callback"
import googleCalendarAuthCallback from "../controllers/auth/google-auth/google-calendar-auth-callback"
import generateMicrosoftLoginAuthUrl from "../controllers/auth/microsoft-auth/generate-microsoft-login-auth-url"
import generateMicrosoftCalendarAuthUrl from "../controllers/auth/microsoft-auth/generate-microsoft-calendar-auth-url"
import microsoftLoginAuthCallback from "../controllers/auth/microsoft-auth/microsoft-login-auth-callback"
import microsoftCalendarAuthCallback from "../controllers/auth/microsoft-auth/microsoft-calendar-auth-callback"
import checkIfUsernameExists from "../controllers/auth/check-if-username-exists"
import checkIfContactExists from "../controllers/auth/check-if-contact-exists"
import addCloudUserPersonalInfo from "../controllers/auth/add-cloud-user-personal-info"
import addSecondaryContactMethod from "../controllers/auth/add-secondary-contact-method"
import revokeGoogleCalendarAccess from "../controllers/auth/google-auth/revoke-google-calendar-access"
import revokeMicrosoftCalendarAccess from "../controllers/auth/microsoft-auth/revoke-microsoft-calendar-access"
import sendPhoneVerificationCode from "../controllers/auth/twilio/send-phone-verification-code"
import verifyUserPhoneCode from "../controllers/auth/twilio/verify-user-phone-code"
import sendEmailVerificationCode from "../controllers/auth/twilio/send-email-verification-code"
import verifyUserEmailCode from "../controllers/auth/twilio/verify-user-email-code"
import registerUsername from "../controllers/auth/register-username"

import jwtVerify from "../middleware/jwt-verify"
import validateLogin from "../middleware/request-validation/auth/validate-login"
import validateRegister from "../middleware/request-validation/auth/validate-register"
import validateGoogleQueryCode from "../middleware/request-validation/auth/validate-google-query-code"
import validateChangePassword from "../middleware/request-validation/auth/validate-change-password"
import validateUsername from "../middleware/request-validation/auth/validate-username"
import validateContact from "../middleware/request-validation/auth/validate-contact"
import determineContactType from "../middleware/auth/determine-contact-type/determine-contact-type"
import determineRegisterContactType	from "../middleware/auth/determine-contact-type/determine-register-contact-type"
import determineChangePasswordContactType from "../middleware/auth/determine-contact-type/determine-change-password-contact-type"
import validateAddCloudUserPersonalInfo from "../middleware/request-validation/auth/validate-add-cloud-user-personal-info"
import confirmUserHasGoogleCalendar from "../middleware/auth/confirm-user-has-google-calendar"
import confirmUserHasMicrosoftCalendar from "../middleware/auth/confirm-user-has-microsoft-calendar"
import confirmUserHasPhoneNumber from "../middleware/auth/twilio/confirm-user-has-phone-number"
import confirmUserPhoneNotVerified from "../middleware/auth/twilio/confirm-user-phone-not-verified"
import validateContactCode from "../middleware/request-validation/auth/validate-contact-code"
import confirmUserHasEmail from "../middleware/auth/twilio/confirm-user-has-email"
import confirmUserEmailNotVerified from "../middleware/auth/twilio/confirm-user-email-not-verified"
import confirmUserHasPhoneVerificationCode from "../middleware/auth/twilio/confirm-user-has-phone-verification-code"
import confirmUserHasEmailVerificationCode from "../middleware/auth/twilio/confirm-user-has-email-verification-code"
import validateMicrosoftQueryCode from "../middleware/request-validation/auth/validate-microsoft-query-code"
import validateGoogleCalendarCallback from "../middleware/request-validation/auth/validate-google-calendar-callback"
import validateMicrosoftCalendarCallback from "../middleware/request-validation/auth/validate-microsoft-calendar-callback"

const authRoutes = express.Router()

authRoutes.post("/login", validateLogin, login)
authRoutes.post("/register", validateRegister, determineRegisterContactType, register)
authRoutes.post("/logout", logout)

authRoutes.post("/change-password", jwtVerify, validateChangePassword, determineChangePasswordContactType, changePassword)
authRoutes.post("/register-username", jwtVerify, validateUsername, registerUsername)
authRoutes.post("/does-username-exist", validateUsername, checkIfUsernameExists)
authRoutes.post("/does-contact-exist", validateContact, determineContactType, checkIfContactExists)

authRoutes.post("/google-auth/login-callback", validateGoogleQueryCode, googleLoginAuthCallback)
authRoutes.post("/google-auth/calendar-callback", jwtVerify, validateGoogleCalendarCallback, googleCalendarAuthCallback)

authRoutes.post("/google-auth/revoke-google-calendar-access", jwtVerify, confirmUserHasGoogleCalendar, revokeGoogleCalendarAccess)

authRoutes.get("/microsoft-auth/generate-login-auth-url", generateMicrosoftLoginAuthUrl)
authRoutes.get("/microsoft-auth/generate-calendar-auth-url", jwtVerify, generateMicrosoftCalendarAuthUrl)

authRoutes.post("/microsoft-auth/login-callback", validateMicrosoftQueryCode, microsoftLoginAuthCallback)
authRoutes.get("/microsoft-auth/calendar-callback", validateMicrosoftCalendarCallback, microsoftCalendarAuthCallback)

authRoutes.post("/microsoft-auth/revoke-microsoft-calendar-access",
	jwtVerify,
	confirmUserHasMicrosoftCalendar,
	revokeMicrosoftCalendarAccess
)

authRoutes.post("/add-cloud-user-personal-info", jwtVerify, validateAddCloudUserPersonalInfo, addCloudUserPersonalInfo)
authRoutes.post("/add-secondary-contact", jwtVerify, validateContact, determineContactType, addSecondaryContactMethod)

authRoutes.post(
	"/twilio/send-phone-verification-code",
	jwtVerify,
	confirmUserHasPhoneNumber,
	confirmUserPhoneNotVerified,
	sendPhoneVerificationCode
)

authRoutes.post(
	"/twilio/verify-user-phone-code",
	jwtVerify,
	validateContactCode,
	confirmUserHasPhoneNumber,
	confirmUserPhoneNotVerified,
	confirmUserHasPhoneVerificationCode,
	verifyUserPhoneCode
)

authRoutes.post(
	"/twilio/send-email-verification-code",
	jwtVerify,
	confirmUserHasEmail,
	confirmUserEmailNotVerified,
	sendEmailVerificationCode
)

authRoutes.post(
	"/twilio/verify-user-email-code",
	jwtVerify,
	validateContactCode,
	confirmUserHasEmail,
	confirmUserEmailNotVerified,
	confirmUserHasEmailVerificationCode,
	verifyUserEmailCode
)

export default authRoutes
