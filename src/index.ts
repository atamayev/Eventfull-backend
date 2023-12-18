import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDatabase from "./setup-and-security/db-connect"
import jwtVerify from "./middleware/jwt-verify"

import authRoutes from "./routes/auth-routes"
import calendarRoutes from "./routes/calendar-routes"
import listsRoutes from "./routes/lists-routes"
import searchRoutes from "./routes/search-routes"
import socialRoutes from "./routes/social-routes"
import eventsRoutes from "./routes/events-routes"

dotenv.config()

const port = process.env.PORT || 8000

void connectDatabase()

const app = express()

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin as string)
	res.header("Access-Control-Allow-Credentials", "true")
	next()
})

app.use(cors({
	credentials: true,
	origin: (origin, callback) => {
		callback(null, true)
	}
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/calendar", jwtVerify, calendarRoutes)
app.use("/api/events", jwtVerify, eventsRoutes)
app.use("/api/lists", jwtVerify, listsRoutes)
app.use("/api/search", jwtVerify, searchRoutes)
app.use("/api/social", jwtVerify, socialRoutes)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
app.listen(port, () => {
	console.info(`Listening on port ${port}`)
})
