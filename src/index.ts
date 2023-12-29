import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { createServer } from "http"
import cookieParser from "cookie-parser"
import { Server as SocketIOServer } from "socket.io"
import jwtVerify from "./middleware/jwt/jwt-verify"
import connectDatabase from "./setup-and-security/db-connect"
import jwtVerifyMiddleware from "./middleware/jwt/verify-socket-jwt"

import authRoutes from "./routes/auth-routes"
import calendarRoutes from "./routes/calendar-routes"
import listsRoutes from "./routes/lists-routes"
import searchRoutes from "./routes/search-routes"
import socialRoutes from "./routes/social-routes"
import eventsRoutes from "./routes/events-routes"
import profileRoutes from "./routes/profile-routes"
import SocketManager from "./sockets/socket-manager"

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 8000

void connectDatabase()

const app = express()

const server = createServer(app)

const io = new SocketIOServer(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST"],
		credentials: true
	}
})

io.use(jwtVerifyMiddleware)
SocketManager.getInstance(io)

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
app.use("/api/profile", jwtVerify, profileRoutes)
app.use("/api/search", jwtVerify, searchRoutes)
app.use("/api/social", jwtVerify, socialRoutes)

app.use("*", (req, res) => res.status(404).json({ error: "Route not found"}))

// Initialization of server:
server.listen(port, "0.0.0.0", () => {
	console.info(`Listening on port ${port}`)
})
