import express from "express"

import retrieveUsers from "../../controllers/admin/users/retrieve-users"
import retrieveSingleUser from "../../controllers/admin/users/retrieve-single-user"

import validateUserId from "../../middleware/request-validation/admin/users/validate-user-id"

const adminUsersRoutes = express.Router()

adminUsersRoutes.get("/get-users", retrieveUsers)

adminUsersRoutes.get("/get-user/:userId", validateUserId, retrieveSingleUser)

export default adminUsersRoutes
