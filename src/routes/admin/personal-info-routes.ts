import express from "express"

import retrieveAdminPersonalInfo from "../../controllers/admin/personal-info/retrieve-admin-personal-info"

const adminPersonalInfoRoutes = express.Router()

adminPersonalInfoRoutes.get("/retrieve-personal-data", retrieveAdminPersonalInfo)

export default adminPersonalInfoRoutes
