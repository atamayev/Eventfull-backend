import express from "express"

import validateSearchUsername from "../middleware/request-validation/search/validate-search-username"
import validateSearchEventName from "../middleware/request-validation/search/validate-search-event-name"

import searchForEventName from "../controllers/search/search-for-event"
import searchForUsername from "../controllers/search/search-for-username"

const searchRoutes = express.Router()

// For Empty Username Search:
searchRoutes.get("/username/", validateSearchUsername, searchForUsername)
searchRoutes.get("/username/:username", validateSearchUsername, searchForUsername)
searchRoutes.get("/event-name/:eventName", validateSearchEventName, searchForEventName)

export default searchRoutes
