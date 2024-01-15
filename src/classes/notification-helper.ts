import _ from "lodash"
import { Types } from "mongoose"
import SocketManager from "./socket-manager"
import AwsSnsService from "./aws-sns-service"
import getUserArn from "../utils/auth-helpers/aws/get-user-arn"
import returnCorrectMessageType from "../utils/notifications/create-notifications/return-correct-message-type"
import noNotificationTokenMessage from "../utils/notifications/no-notification-token-message"

export default class NotificationHelper {
	public static async sendFriendRequest (user: User, receiver: User): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendFriendRequest(user, receiver._id)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info(noNotificationTokenMessage(receiver))
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const message = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
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

	public static retractFriendRequest (userId: Types.ObjectId, friendId: Types.ObjectId): void {
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

	public static async sendPrivateMessage (receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info(noNotificationTokenMessage(receiver))
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`New Message from ${privateMessage.senderDetails.username || "User"}`,
					privateMessage.text,
					"Private Chat Screen",
					{ privateChatId: privateMessage.privateChatId }
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

	public static markPrivateMessageRead (receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
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

	public static updatePrivateMessage(receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
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

	public static deletePrivateMessage(receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
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

	public static async replyToPrivateMessage(receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info(noNotificationTokenMessage(receiver))
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`${privateMessage.senderDetails.username || "User"} replied to your message`,
					privateMessage.text,
					"Private Chat Screen",
					{ privateChatId: privateMessage.privateChatId }
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
	public static async sendGroupMessage(
		receivers: User[],
		groupMessage: GroupMessageWithChatId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiver of receivers) {
				if (
					socketManager.isUserOnline(receiver._id) === true &&
					socketManager.isUserActive(receiver._id) === true
				) {
					socketManager.sendGroupMessage(receiver._id, groupMessage)
				} else {
					// eslint-disable-next-line max-depth
					if (!_.isString(receiver.notificationToken)) {
						console.info(noNotificationTokenMessage(receiver))
						continue
					}
					const endpointArn = getUserArn(receiver)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const notificationMessage = returnCorrectMessageType(
						receiver.primaryDevicePlatform,
						`New Message from ${groupMessage.senderDetails.username || "User"}`,
						groupMessage.text,
						"Group Chat Screen",
						{ groupChatId: groupMessage.groupChatId }
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

	public static markGroupMessageRead (
		senderId: Types.ObjectId,
		receiverIds: Types.ObjectId[],
		groupMessage: GroupMessageWithChatId,
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiverId of receiverIds) {
				if (socketManager.isUserOnline(receiverId) === false) {
					continue
				}
				socketManager.markGroupMessageRead(senderId, receiverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static updateGroupMessage(
		receiverIds: Types.ObjectId[],
		groupMessage: GroupMessageWithChatId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiverId of receiverIds) {
				if (socketManager.isUserOnline(receiverId) === false) {
					continue
				}
				socketManager.updateGroupMessage(receiverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static deleteGroupMessage(
		receiverIds: Types.ObjectId[],
		groupMessage: GroupMessageWithChatId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiverId of receiverIds) {
				if (socketManager.isUserOnline(receiverId) === false) {
					continue
				}
				socketManager.updateGroupMessage(receiverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static async replyToGroupMessage(receivers: User[], groupMessage: GroupMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiver of receivers) {
				if (
					socketManager.isUserOnline(receiver._id) === true &&
					socketManager.isUserActive(receiver._id) === true
				) {
					socketManager.sendGroupMessage(receiver._id, groupMessage)
				} else {
					// eslint-disable-next-line max-depth
					if (!_.isString(receiver.notificationToken)) {
						console.info(noNotificationTokenMessage(receiver))
						continue
					}
					const endpointArn = getUserArn(receiver)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const notificationMessage = returnCorrectMessageType(
						receiver.primaryDevicePlatform,
						`New Message from ${groupMessage.senderDetails.username || "User"}`,
						groupMessage.text,
						"Group Chat Screen",
						{ groupChatId: groupMessage.groupChatId }
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
