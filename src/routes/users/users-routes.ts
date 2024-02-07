import express from "express"

import retrieveUsers from "../../controllers/admin/users/retrieve-users"

const adminUsersRoutes = express.Router()

adminUsersRoutes.get("/get-users", retrieveUsers)

export default adminUsersRoutes
