import express from "express"

import confirmUserHasEmail from "../../middleware/auth/twilio/confirm-user-has-email"
import validateContactCode from "../../middleware/request-validation/auth/validate-contact-code"
import confirmUserHasPhoneNumber from "../../middleware/auth/twilio/confirm-user-has-phone-number"
import confirmUserPhoneNotVerified from "../../middleware/auth/twilio/confirm-user-phone-not-verified"
import confirmUserEmailNotVerified from "../../middleware/auth/twilio/confirm-user-email-not-verified"
import confirmUserHasPhoneVerificationCode from "../../middleware/auth/twilio/confirm-user-has-phone-verification-code"
import confirmUserHasEmailVerificationCode from "../../middleware/auth/twilio/confirm-user-has-email-verification-code"

import verifyUserPhoneCode from "../../controllers/auth/twilio/verify-user-phone-code"
import verifyUserEmailCode from "../../controllers/auth/twilio/verify-user-email-code"
import sendPhoneVerificationCode from "../../controllers/auth/twilio/send-phone-verification-code"
import sendEmailVerificationCode from "../../controllers/auth/twilio/send-email-verification-code"

const twilioAuthRoutes = express.Router()

twilioAuthRoutes.post(
	"/send-phone-verification-code",
	confirmUserHasPhoneNumber,
	confirmUserPhoneNotVerified,
	sendPhoneVerificationCode
)

twilioAuthRoutes.post(
	"/verify-user-phone-code",
	validateContactCode,
	confirmUserHasPhoneNumber,
	confirmUserPhoneNotVerified,
	confirmUserHasPhoneVerificationCode,
	verifyUserPhoneCode
)

twilioAuthRoutes.post(
	"/send-email-verification-code",
	confirmUserHasEmail,
	confirmUserEmailNotVerified,
	sendEmailVerificationCode
)

twilioAuthRoutes.post(
	"/verify-user-email-code",
	validateContactCode,
	confirmUserHasEmail,
	confirmUserEmailNotVerified,
	confirmUserHasEmailVerificationCode,
	verifyUserEmailCode
)

export default twilioAuthRoutes
