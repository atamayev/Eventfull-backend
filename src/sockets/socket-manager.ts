import _ from "lodash"
import { Server as SocketIOServer, Socket } from "socket.io"

export default class SocketManager {
	private _io: SocketIOServer
	private _userConnections: Map<string, string>
	private static _instance: SocketManager | null = null

	constructor(io: SocketIOServer) {
		this._io = io
		this._userConnections = new Map<string, string>()
		this.initializeListeners()
	}

	public static getInstance(io?: SocketIOServer): SocketManager {
		if (_.isNull(SocketManager._instance)) {
			if (_.isUndefined(io)) {
				throw new Error("SocketManager requires an io instance to be initialized")
			}
			SocketManager._instance = new SocketManager(io)
		}
		return SocketManager._instance
	}

	private initializeListeners(): void {
		this._io.on("connection", (socket: Socket) => this.handleConnection(socket))
	}

	private handleConnection(socket: Socket): void {
		console.log(`User connected: ${socket.id}`)

		socket.on("login", (userId: string) => this.handleLogin(userId, socket))
		socket.on("send-friend-request", (data: { fromUserId: string, toUserId: string }) => this.handleFriendRequest(data))
		socket.on("disconnect", () => this.handleDisconnect(socket))
	}

	private handleLogin(userId: string, socket: Socket): void {
		this._userConnections.set(userId, socket.id)
		console.log(`User ${userId} logged in with socket ${socket.id}`)
	}

	private handleFriendRequest(data: { fromUserId: string, toUserId: string }): void {
		const receiverSocketId = this._userConnections.get(data.toUserId)
		if (!_.isUndefined(receiverSocketId)) {
			this._io.to(receiverSocketId).emit("friend-request", { from: data.fromUserId })
			console.log(`Friend request sent from ${data.fromUserId} to ${data.toUserId}`)
		} else {
			console.log(`User ${data.toUserId} is not online`)
		}
	}

	private handleDisconnect(socket: Socket): void {
		this._userConnections.forEach((socketId, userId) => {
			if (socketId === socket.id) {
				this._userConnections.delete(userId)
				console.log(`User ${userId} disconnected`)
			}
		})
	}
}
