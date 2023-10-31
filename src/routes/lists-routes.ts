import express from "express"
import { getEventCategories, getEventTypes } from "../controllers/lists-controller"

const listsRoutes = express.Router()

listsRoutes.get("/get-event-categories", getEventCategories)
listsRoutes.get("/get-event-types", getEventTypes)

export default listsRoutes
