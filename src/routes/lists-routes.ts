import express from "express"
import { fetchEventCategories, fetchEventTypes } from "../controllers/lists-controller"

const listsRoutes = express.Router()

//Add Middleware to verify JWT here, validate the request body
listsRoutes.get("/get-event-categories", fetchEventCategories)
listsRoutes.get("/get-event-types", fetchEventTypes)

export default listsRoutes
