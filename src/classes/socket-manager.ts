import _ from "lodash"
import { Types } from "mongoose"
import { Server as SocketIOServer, Socket } from "socket.io"

export default class SocketManager {
	private _io: SocketIOServer
	// eslint-disable-next-line no-inline-comments
	private _userConnections: Map<string, UserConnectionInfo> // Maps userId to socketId
	private static _instance: SocketManager | null = null

	constructor(io: SocketIOServer) {
		this._io = io
		this._userConnections = new Map<string, UserConnectionInfo>()
		this.initializeListeners()
	}

	public static assignIo(io: SocketIOServer): void {
		if (_.isNull(SocketManager._instance)) {
			SocketManager._instance = new SocketManager(io)
		} else {
			throw new Error("SocketManager instance has already been initialized")
		}
	}

	public static getInstance(): SocketManager {
		if (_.isNull(SocketManager._instance)) {
			throw new Error("SocketManager instance is not initialized. Call assignIo first.")
		}
		return SocketManager._instance
	}

	private initializeListeners(): void {
		// This connection socket endpoint is hit whenever the user logs in or opens the app
		this._io.on("connection", (socket: Socket) => {
			this.handleConnection(socket)
		})
	}

	// This is called whenever a user connects to socket io (from the this._io.on("connection") listener)
	private handleConnection(socket: Socket): void {
		if (_.isUndefined(socket.userId)) {
			console.error(`User ${socket.id} is not authenticated`)
			return
		}
		this.handleEstablishConnection(socket.userId, socket)
		socket.on("disconnect", () => this.handleDisconnect(socket))
	}

	private handleEstablishConnection(userId: Types.ObjectId, socket: Socket): void {
		this._userConnections.set(_.toString(userId), { socketId: socket.id, status: "active"})
		this._io.to(_.toString(userId)).emit("connected")
	}

	public isUserOnline(userId: Types.ObjectId): boolean {
		return this._userConnections.has(_.toString(userId))
	}

	public setUserStatus(userId: Types.ObjectId, status: AppStates): void {
		const userConnection = this._userConnections.get(_.toString(userId))
		if (!_.isUndefined(userConnection)) {
			userConnection.status = status
			this._userConnections.set(_.toString(userId), userConnection)
		}
	}

	public isUserActive(userId: Types.ObjectId): boolean {
		const userConnection = this._userConnections.get(_.toString(userId))
		return userConnection ? userConnection.status === "active" : false
	}

	public handleSendFriendRequest(data: { fromUser: User, toUserId: Types.ObjectId }): void {
		const receiverSocketId = this._userConnections.get(_.toString(data.toUserId))?.socketId
		if (!_.isUndefined(receiverSocketId)) {
			this._io.to(receiverSocketId).emit(
				"friend-request", { fromUserId: _.toString(data.fromUser._id), fromUsername: data.fromUser.username }
			)
		} else {
			console.info(`User ${data.toUserId} is not online`)
		}
	}

	public handleRetractFriendRequest(data: { fromUserId: Types.ObjectId, toUserId: Types.ObjectId }): void {
		const receiverSocketId = this._userConnections.get(_.toString(data.toUserId))?.socketId
		if (!_.isUndefined(receiverSocketId)) {
			this._io.to(receiverSocketId).emit(
				"remove-friend-request", { fromUserId: _.toString(data.fromUserId) }
			)
		} else {
			console.info(`User ${data.toUserId} is not online`)
		}
	}

	private handleDisconnect(socket: Socket): void {
		const userId = socket.userId
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (userId && this._userConnections.has(_.toString(userId))) {
			this._userConnections.delete(_.toString(userId))
		}
	}
}
