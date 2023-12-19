import express from "express"
import searchForUsername from "../controllers/search/search-for-username"

import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"
import validateSearchEventName from "../middleware/request-validation/search/validate-search-event-name"
import searchForEventName from "../controllers/search/search-for-event"

const searchRoutes = express.Router()

searchRoutes.get("/username/:username", validateSearchUsername, searchForUsername)
searchRoutes.get("/event-name/:eventName", validateSearchEventName, searchForEventName)

export default searchRoutes
