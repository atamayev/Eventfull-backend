import _ from "lodash"
import { Types } from "mongoose"
import SocketManager from "./socket-manager"
import AwsSnsService from "./aws-sns-service"
import getUserArn from "../utils/auth-helpers/aws/get-user-arn"
import returnCorrectMessageType from "../utils/notifications/create-notifications/return-correct-message-type"

// TODO: Convert to static methods?
export default new class NotificationHelper {
	public async sendFriendRequest (user: User, friend: User): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(friend._id) === true &&
				socketManager.isUserActive(friend._id) === true
			) {
				socketManager.sendFriendRequest(user, friend._id)
			} else {
				if (!_.isString(friend.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(friend)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const message = returnCorrectMessageType(
					friend.primaryDevicePlatform,
					"New Friend Request",
					`${user.username || "User"} sent you a friend request.`,
					"Chat"
				)
				await AwsSnsService.getInstance().sendNotification(
					endpointArn,
					message
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public retractFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(friendId) === false) {
				return
			}
			socketManager.retractFriendRequest(userId, friendId)
		} catch (error) {
			console.error(error)
		}
	}

	// TODO: Add a socket/notification for when a friend request is accepted

	// TODO: For all of the messages methods, consider sending the message sent time as well.
	// Then, when the user recieves the text, they can see the time it was sent, and can tell the backend when they recieved it.

	public async sendPrivateMessage (receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`New Message from ${privateMessage.senderDetails.username || "User"}`,
					privateMessage.text,
					"Chat"
				)
				await AwsSnsService.getInstance().sendNotification(
					endpointArn,
					notificationMessage
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public markPrivateMessageRead (receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiverId) === false) {
				return
			}
			socketManager.markPrivateMessageRead(receiverId, privateMessage)
		} catch (error) {
			console.error(error)
		}
	}

	public updatePrivateMessage(receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiverId) === false) {
				return
			}
			socketManager.updatePrivateMessage(receiverId, privateMessage)
		} catch (error) {
			console.error(error)
		}
	}

	public async replyToPrivateMessage(receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`${privateMessage.senderDetails.username || "User"} replied to your message`,
					privateMessage.text,
					"Chat"
				)
				await AwsSnsService.getInstance().sendNotification(
					endpointArn,
					notificationMessage
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	// eslint-disable-next-line max-params
	public async sendGroupMessage(
		recievers: User[],
		groupMessage: GroupMessageWithChatId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (
					socketManager.isUserOnline(reciever._id) === true &&
					socketManager.isUserActive(reciever._id) === true
				) {
					socketManager.sendGroupMessage(reciever._id, groupMessage)
				} else {
					// eslint-disable-next-line max-depth
					if (!_.isString(reciever.notificationToken)) {
						console.info("Friend does not have a notification token (or friend isn't logged in).")
						continue
					}
					const endpointArn = getUserArn(reciever)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const notificationMessage = returnCorrectMessageType(
						reciever.primaryDevicePlatform,
						`New Message from ${groupMessage.senderDetails.username || "User"}`,
						groupMessage.text,
						"Chat"
					)
					await AwsSnsService.getInstance().sendNotification(
						endpointArn,
						notificationMessage
					)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	public markGroupMessageRead (
		senderId: Types.ObjectId,
		recieverIds: Types.ObjectId[],
		groupMessage: GroupMessageWithChatId,
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const recieverId of recieverIds) {
				if (socketManager.isUserOnline(recieverId) === false) {
					continue
				}
				socketManager.markGroupMessageRead(senderId, recieverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public updateGroupMessage(
		recieverIds: Types.ObjectId[],
		groupMessage: GroupMessageWithChatId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const recieverId of recieverIds) {
				if (socketManager.isUserOnline(recieverId) === false) {
					continue
				}
				socketManager.updateGroupMessage(recieverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public async replyToGroupMessage(recievers: User[], groupMessage: GroupMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (
					socketManager.isUserOnline(reciever._id) === true &&
					socketManager.isUserActive(reciever._id) === true
				) {
					socketManager.sendGroupMessage(reciever._id, groupMessage)
				} else {
					// eslint-disable-next-line max-depth
					if (!_.isString(reciever.notificationToken)) {
						console.info("Friend does not have a notification token (or friend isn't logged in).")
						continue
					}
					const endpointArn = getUserArn(reciever)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const notificationMessage = returnCorrectMessageType(
						reciever.primaryDevicePlatform,
						`New Message from ${groupMessage.senderDetails.username || "User"}`,
						groupMessage.text,
						"Chat"
					)
					await AwsSnsService.getInstance().sendNotification(
						endpointArn,
						notificationMessage
					)
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
}
