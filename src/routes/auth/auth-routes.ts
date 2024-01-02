import express from "express"

import validateUserSocketState from "../../middleware/request-validation/auth/validate-user-socket-state"

import jwtVerify from "../../middleware/jwt/jwt-verify"
import validateLogin from "../../middleware/request-validation/auth/validate-login"
import validateRegister from "../../middleware/request-validation/auth/validate-register"
import validateChangePassword from "../../middleware/request-validation/auth/validate-change-password"
import validateUsername from "../../middleware/request-validation/auth/validate-username"
import validateContact from "../../middleware/request-validation/auth/validate-contact"
import determineContactType from "../../middleware/auth/determine-contact-type/determine-contact-type"
import determineRegisterContactType	from "../../middleware/auth/determine-contact-type/determine-register-contact-type"
import validateAddCloudUserPersonalInfo from "../../middleware/request-validation/auth/validate-add-cloud-user-personal-info"
import determineChangePasswordContactType from "../../middleware/auth/determine-contact-type/determine-change-password-contact-type"

import login from "../../controllers/auth/login"
import logout from "../../controllers/auth/logout"
import register from "../../controllers/auth/register"
import changePassword from "../../controllers/auth/change-password"
import registerUsername from "../../controllers/auth/register-username"
import updateUserSocketState from "../../controllers/auth/update-user-socket-state"
import checkIfUsernameExists from "../../controllers/auth/check-if-username-exists"
import checkIfContactExists from "../../controllers/auth/check-if-contact-exists"
import addCloudUserPersonalInfo from "../../controllers/auth/add-cloud-user-personal-info"
import addSecondaryContactMethod from "../../controllers/auth/add-secondary-contact-method"


import googleAuthRoutes from "./google-auth-routes"
import microsoftAuthRoutes from "./microsoft-auth-routes"
import twilioAuthRoutes from "./twilio-auth-routes"

const authRoutes = express.Router()

authRoutes.post("/login", validateLogin, login)
authRoutes.post("/register", validateRegister, determineRegisterContactType, register)
authRoutes.post("/logout", jwtVerify, logout)

authRoutes.post("/change-password", jwtVerify, validateChangePassword, determineChangePasswordContactType, changePassword)
authRoutes.post("/register-username", jwtVerify, validateUsername, registerUsername)
authRoutes.post("/does-username-exist", validateUsername, checkIfUsernameExists)
authRoutes.post("/does-contact-exist", validateContact, determineContactType, checkIfContactExists)

authRoutes.post("/add-cloud-user-personal-info", jwtVerify, validateAddCloudUserPersonalInfo, addCloudUserPersonalInfo)
authRoutes.post("/add-secondary-contact", jwtVerify, validateContact, determineContactType, addSecondaryContactMethod)

authRoutes.post("/update-user-socket-state", jwtVerify, validateUserSocketState, updateUserSocketState)

authRoutes.use("/google-auth", googleAuthRoutes)
authRoutes.use("/microsoft-auth", microsoftAuthRoutes)
authRoutes.use("/twilio-auth", twilioAuthRoutes)

export default authRoutes
