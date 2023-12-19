import express from "express"
import searchForUsername from "../controllers/search/search-for-username"

import validateUsernameInParams from "../middleware/request-validation/search/validate-username-in-params"
import validateEventNameInParams from "../middleware/request-validation/search/validate-event-name-in-params"
import searchForEventName from "../controllers/search/search-for-event"

const searchRoutes = express.Router()

searchRoutes.get("/username/:username", validateUsernameInParams, searchForUsername)
searchRoutes.get("/event-name/:eventName", validateEventNameInParams, searchForEventName)

export default searchRoutes
