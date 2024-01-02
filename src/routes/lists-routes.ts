import express from "express"

import getEventTypes from "../controllers/lists/get-event-types"
import getEventCategories from "../controllers/lists/get-event-categories"

const listsRoutes = express.Router()

listsRoutes.get("/get-event-types", getEventTypes)
listsRoutes.get("/get-event-categories", getEventCategories)

export default listsRoutes
