import express from "express"

import adminJwtVerify from "../../middleware/jwt/admin-jwt-verify"
import validateAdminLogin from "../../middleware/request-validation/admin/auth/validate-admin-login"
import validateAdminRegister from "../../middleware/request-validation/admin/auth/validate-admin-register"

import adminLogin from "../../controllers/admin/auth/admin-login"
import adminLogout from "../../controllers/admin/auth/admin-logout"
import adminRegister from "../../controllers/admin/auth/admin-register"

const adminAuthRoutes = express.Router()

adminAuthRoutes.post("/login", validateAdminLogin, adminLogin)
adminAuthRoutes.post("/register", validateAdminRegister, adminRegister)
adminAuthRoutes.post("/logout", adminJwtVerify, adminLogout)

export default adminAuthRoutes
