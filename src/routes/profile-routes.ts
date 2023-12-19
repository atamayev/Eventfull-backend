import express from "express"
import validateColorTheme from "../middleware/request-validation/profile/validate-color-theme"
import changeColorTheme from "../controllers/profile/change-color-theme"

const profileRoutes = express.Router()

profileRoutes.post("/change-color-theme", validateColorTheme, changeColorTheme)

export default profileRoutes
