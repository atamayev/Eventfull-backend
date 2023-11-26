import express from "express"
import searchForUsername from "../controllers/search/search-for-username"

import validateUsernameInParams from "../middleware/request-validation/search-routes/validate-username-in-params"

const searchRoutes = express.Router()

searchRoutes.get("/username/:username", validateUsernameInParams, searchForUsername)

export default searchRoutes
