import _ from "lodash"
import { Types } from "mongoose"
import { Server as SocketIOServer, Socket } from "socket.io"

export default class SocketManager {
	private _userConnections: Map<string, UserConnectionInfo> = new Map<string, UserConnectionInfo>()
	private static _instance: SocketManager | null = null

	constructor(private readonly io: SocketIOServer) {
		this.initializeListeners()
	}

	get userConnections(): Map<string, UserConnectionInfo> {
		return this._userConnections
	}

	set userConnections(value: Map<string, UserConnectionInfo>) {
		this._userConnections = value
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
		this.io.on("connection", (socket: Socket) => {
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
		this.userConnections.set(_.toString(userId), { socketId: socket.id, status: "active"})
		this.io.to(_.toString(userId)).emit("connected")
	}

	public isUserOnline(userId: Types.ObjectId): boolean {
		return this.userConnections.has(_.toString(userId))
	}

	public setUserStatus(userId: Types.ObjectId, status: AppStates): void {
		const userConnection = this.userConnections.get(_.toString(userId))
		if (_.isUndefined(userConnection)) return

		userConnection.status = status
		this.userConnections.set(_.toString(userId), userConnection)
	}

	public isUserActive(userId: Types.ObjectId): boolean {
		const userConnection = this.userConnections.get(_.toString(userId))
		return userConnection ? userConnection.status === "active" : false
	}

	public sendFriendRequest(fromUser: User, toUserId: Types.ObjectId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit(
			"friend-request", { fromUserId: _.toString(fromUser._id), fromUsername: fromUser.username }
		)
	}

	public retractFriendRequest(fromUserId: Types.ObjectId, toUserId: Types.ObjectId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit(
			"remove-friend-request", { fromUserId: _.toString(fromUserId) }
		)
	}

	public sendPrivateMessage(toUserId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("private-message", privateMessage)
	}

	public updatePrivateMessageStatus(
		toUserId: Types.ObjectId,
		privateMessage: PrivateMessageWithChatId,
	): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit(
			"update-private-message-status", {
				privateChatId: _.toString(privateMessage.privateChatId),
				privateMessageId: _.toString(privateMessage._id),
				newMessageStatus: privateMessage.messageStatus,
			}
		)
	}

	public updatePrivateMessage(toUserId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("update-private-message", privateMessage)
	}

	public deletePrivateMessage(toUserId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("delete-private-message", privateMessage)
	}

	public sendGroupMessage(toUserId: Types.ObjectId, groupMessage: GroupMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("group-message", groupMessage)
	}

	public updateGroupMessageStatus(
		toUserId: Types.ObjectId,
		updatedGroupMessage: GroupMessageWithChatId,
		newMessageStatus: MessageStatuses,
	): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("update-group-message-status", {
			groupChatId: _.toString(updatedGroupMessage.groupChatId),
			groupMessageId: _.toString(updatedGroupMessage._id),
			newMessageStatus,
			senderUsername: updatedGroupMessage.senderDetails.username
		})
	}

	public updateGroupMessage(toUserId: Types.ObjectId, groupMessage: GroupMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("update-group-message", groupMessage)
	}

	public deleteGroupMessage(toUserId: Types.ObjectId, groupMessage: GroupMessageWithChatId): void {
		const receiverSocketId = this.userConnections.get(_.toString(toUserId))?.socketId
		if (_.isUndefined(receiverSocketId)) return
		this.io.to(receiverSocketId).emit("delete-group-message", groupMessage)
	}

	private handleDisconnect(socket: Socket): void {
		const userId = socket.userId
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (userId && this.userConnections.has(_.toString(userId))) {
			this.userConnections.delete(_.toString(userId))
		}
	}
}
