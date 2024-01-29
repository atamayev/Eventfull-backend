import express from "express"

import adminJwtVerify from "../../middleware/jwt/admin-jwt-verify"
import retrieveAdminPersonalInfo from "../../controllers/admin/personal-info/retrieve-admin-personal-info"

const adminPersonalInfoRoutes = express.Router()

adminPersonalInfoRoutes.get("/retrieve-personal-data", adminJwtVerify, retrieveAdminPersonalInfo)

export default adminPersonalInfoRoutes
