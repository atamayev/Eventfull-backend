import express from "express"

import adminJwtVerify from "../../middleware/jwt/admin-jwt-verify"
import validateAdminLogin from "../../middleware/request-validation/admin/auth/validate-admin-login"
import validateInitialAdminRegisterInfo from "../../middleware/request-validation/admin/auth/validate-initial-admin-register-info"
import validateSecondaryAdminRegisterInfo from "../../middleware/request-validation/admin/auth/validate-secondary-admin-register-info"
import finishAdminRegistration from "../../controllers/admin/auth/finish-admin-registration"

import adminLogin from "../../controllers/admin/auth/admin-login"
import adminLogout from "../../controllers/admin/auth/admin-logout"
import addAdmin from "../../controllers/admin/auth/add-admin"
import validateAdminOTPLogin from "../../middleware/request-validation/admin/auth/validate-admin-otp-login"
import adminLoginOTP from "../../controllers/admin/auth/admin-login-otp"

const adminAuthRoutes = express.Router()

adminAuthRoutes.post("/login", validateAdminLogin, adminLogin)
adminAuthRoutes.post("/add-admin", validateInitialAdminRegisterInfo, addAdmin)
adminAuthRoutes.post("/otp-login", validateAdminOTPLogin, adminLoginOTP)
adminAuthRoutes.post("/finish-admin-registration", adminJwtVerify, validateSecondaryAdminRegisterInfo, finishAdminRegistration)

adminAuthRoutes.post("/logout", adminLogout)

export default adminAuthRoutes
