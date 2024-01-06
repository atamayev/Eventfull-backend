import _ from "lodash"
import { Types } from "mongoose"
import SocketManager from "./socket-manager"
import AwsSnsService from "./aws-sns-service"
import getUserArn from "../utils/auth-helpers/aws/get-user-arn"
import returnCorrectMessageType from "../utils/notifications/create-notifications/return-correct-message-type"

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

	public retractFriendRequest (user: User, friend: User): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(friend._id) === false) {
				return
			}
			socketManager.retractFriendRequest(user._id, friend._id)
		} catch (error) {
			console.error(error)
		}
	}

	// TODO: Add a socket/notification for when a friend request is accepted

	// TODO: For all of the messages methods, consider sending the message sent time as well.
	// Then, when the user recieves the text, they can see the time it was sent, and can tell the backend when they recieved it.

	// eslint-disable-next-line max-params
	public async sendPrivateMessage (
		sender: User,
		receiver: User,
		message: string,
		privateChatId: Types.ObjectId,
		privateMessageId: Types.ObjectId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, message, privateChatId, privateMessageId)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`New Message from ${sender.username || "User"}`,
					message,
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

	public markPrivateMessageAsRead (receiver: User, privateChatId: Types.ObjectId, privateMessageId: Types.ObjectId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === false) {
				return
			}
			socketManager.markMessageAsRead(receiver._id, privateChatId, privateMessageId)
		} catch (error) {
			console.error(error)
		}
	}

	public updatePrivateMessage(
		receiver: User,
		messageText: string,
		privateChatId: Types.ObjectId,
		privateMessageId: Types.ObjectId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === false) {
				return
			}
			socketManager.updatePrivateMessage(receiver._id, messageText, privateChatId, privateMessageId)
		} catch (error) {
			console.error(error)
		}
	}

	// eslint-disable-next-line max-params
	public async replyToPrivateMessage(
		sender: User,
		receiver: User,
		messageText: string,
		privateChatId: Types.ObjectId,
		privateMessageId: Types.ObjectId,
		replyToMessageId: Types.ObjectId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (
				socketManager.isUserOnline(receiver._id) === true &&
				socketManager.isUserActive(receiver._id) === true
			) {
				socketManager.sendPrivateMessage(receiver._id, messageText, privateChatId, privateMessageId, replyToMessageId)
			} else {
				if (!_.isString(receiver.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const notificationMessage = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					`${sender.username || "User"} replied to your message`,
					messageText,
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
		sender: User,
		recievers: User[],
		messageText: string,
		groupChatId: Types.ObjectId,
		groupMessageId: Types.ObjectId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (
					socketManager.isUserOnline(reciever._id) === true &&
					socketManager.isUserActive(reciever._id) === true
				) {
					socketManager.sendGroupMessage(reciever._id, messageText, groupChatId, groupMessageId)
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
						`New Message from ${sender.username || "User"}`,
						messageText,
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

	public markGroupMessageAsRead (
		sender: User,
		recievers: User[],
		groupChatId: Types.ObjectId,
		groupMessageId: Types.ObjectId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (socketManager.isUserOnline(reciever._id) === false) {
					continue
				}
				socketManager.markGroupMessageAsRead(sender._id, reciever._id, groupChatId, groupMessageId)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public updateGroupMessage(
		recievers: User[],
		updatedMessageText: string,
		groupChatId: Types.ObjectId,
		groupMessageId: Types.ObjectId
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (socketManager.isUserOnline(reciever._id) === false) {
					continue
				}
				socketManager.updateGroupMessage(reciever._id, updatedMessageText, groupChatId, groupMessageId)
			}
		} catch (error) {
			console.error(error)
		}
	}

	// eslint-disable-next-line max-params, max-lines-per-function
	public async replyToGroupMessage(
		sender: User,
		recievers: User[],
		messageText: string,
		groupChatId: Types.ObjectId,
		groupMessageId: Types.ObjectId,
		replyToMessageId: Types.ObjectId
	): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const reciever of recievers) {
				if (
					socketManager.isUserOnline(reciever._id) === true &&
					socketManager.isUserActive(reciever._id) === true
				) {
					socketManager.sendGroupMessage(reciever._id, messageText, groupChatId, groupMessageId, replyToMessageId)
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
						`New Message from ${sender.username || "User"}`,
						messageText,
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
