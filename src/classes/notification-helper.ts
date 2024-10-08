import _ from "lodash"
import { Types } from "mongoose"
import SocketManager from "./socket-manager"
import AwsSnsService from "./aws-sns-service"
import getUserArn from "../utils/auth-helpers/aws/get-user-arn"
import returnCorrectMessageType from "../utils/notifications/create-notifications/return-correct-message-type"

export default class NotificationHelper {
	public static async sendFriendRequest (user: User, receiver: User, createdAt: Date): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === true) {
				socketManager.sendFriendRequest(user, receiver._id, createdAt)
			} if (
				socketManager.isUserStatusBackground(receiver._id) === true ||
				socketManager.isUserOnline(receiver._id) === false
			) {
				if (!_.isString(receiver.notificationToken)) return
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const extraData = {
					userId: _.toString(user._id),
					senderUsername: user.username || "User",
					createdAt
				}

				const notificationData: NotificationData = {
					title: "New Friend Request",
					body: `${user.username || "User"} sent you a friend request.`,
					deepLink: "eventfullny://chat",
					targetPage: "Chat",
					extraData
				}
				const message = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					notificationData
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
			if (socketManager.isUserOnline(friendId) === false)	{
				return
			}
			socketManager.retractFriendRequest(userId, friendId)
		} catch (error) {
			console.error(error)
		}
	}

	public static async acceptFriendRequest (user: User, receiver: User, createdAt: Date): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === true) {
				socketManager.acceptFriendRequest(user, receiver._id, createdAt)
			} if (
				socketManager.isUserStatusBackground(receiver._id) === true ||
				socketManager.isUserOnline(receiver._id) === false
			) {
				if (!_.isString(receiver.notificationToken)) return
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const extraData = {
					userId: _.toString(user._id),
					senderUsername: user.username || "User",
					createdAt
				}

				const notificationData: NotificationData = {
					title: "Friend Request Accepted",
					body: `${user.username || "User"} accepted your friend request.`,
					targetPage: "Chat",
					deepLink: "eventfullny://chat",
					extraData
				}

				const message = returnCorrectMessageType(
					receiver.primaryDevicePlatform,
					notificationData
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

	public static removeFriend (userId: Types.ObjectId, friendId: Types.ObjectId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(friendId) === false) {
				return
			}
			socketManager.removeFriend(userId, friendId)
		} catch (error) {
			console.error(error)
		}
	}

	// TODO: For all of the messages methods, consider sending the message sent time as well.
	// Then, when the user recieves the text, they can see the time it was sent, and can tell the backend when they recieved it.

	public static async sendPrivateMessage (receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === true) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} if (
				socketManager.isUserStatusBackground(receiver._id) === true ||
				socketManager.isUserOnline(receiver._id) === false
			) {
				if (!_.isString(receiver.notificationToken)) return
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const extraData = {
					privateChatId: privateMessage.privateChatId,
					privateMessageId: _.toString(privateMessage._id)
				}
				const notificationData: NotificationData = {
					title: `New Message from ${privateMessage.senderDetails.username || "User"}`,
					body: privateMessage.text,
					deepLink: `eventfullny://chat/private/${privateMessage.privateChatId}`,
					targetPage: "Private Chat Screen",
					extraData
				}
				const notificationMessage = returnCorrectMessageType(receiver.primaryDevicePlatform, notificationData)
				await AwsSnsService.getInstance().sendNotification(
					endpointArn,
					notificationMessage
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static updatePrivateMessageStatus (receiverId: Types.ObjectId, privateMessage: PrivateMessageWithChatId): void {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiverId) === false) {
				return
			}
			socketManager.updatePrivateMessageStatus(receiverId, privateMessage)
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
			socketManager.deletePrivateMessage(receiverId, privateMessage)
		} catch (error) {
			console.error(error)
		}
	}

	public static async replyToPrivateMessage(receiver: User, privateMessage: PrivateMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			if (socketManager.isUserOnline(receiver._id) === true) {
				socketManager.sendPrivateMessage(receiver._id, privateMessage)
			} if (
				socketManager.isUserStatusBackground(receiver._id) === true ||
				socketManager.isUserOnline(receiver._id) === false
			) {
				if (!_.isString(receiver.notificationToken)) return
				const endpointArn = getUserArn(receiver)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const extraData = {
					privateChatId: privateMessage.privateChatId,
					privateMessageId: _.toString(privateMessage._id)
				}
				const notificationData: NotificationData = {
					title: `${privateMessage.senderDetails.username || "User"} replied to your message`,
					body: privateMessage.text,
					targetPage: "Private Chat Screen",
					deepLink: `eventfullny://chat/private/${privateMessage.privateChatId}`,
					extraData
				}
				const notificationMessage = returnCorrectMessageType(receiver.primaryDevicePlatform, notificationData)
				await AwsSnsService.getInstance().sendNotification(
					endpointArn,
					notificationMessage
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static async sendGroupMessage(receivers: User[], groupMessage: GroupMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiver of receivers) {
				if (socketManager.isUserOnline(receiver._id) === true) {
					socketManager.sendGroupMessage(receiver._id, groupMessage)
				} if (
					socketManager.isUserStatusBackground(receiver._id) === true ||
					socketManager.isUserOnline(receiver._id) === false
				) {
					// eslint-disable-next-line max-depth
					if (!_.isString(receiver.notificationToken)) continue
					const endpointArn = getUserArn(receiver)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const extraData = {
						groupChatId: groupMessage.groupChatId,
						groupMessageId: _.toString(groupMessage._id),
						senderUsername: groupMessage.senderDetails.username
					}

					const notificationData: NotificationData = {
						title: `New Message from ${groupMessage.senderDetails.username || "User"}`,
						body: groupMessage.text,
						targetPage: "Group Chat Screen",
						deepLink: `eventfullny://chat/group/${groupMessage.groupChatId}`,
						extraData
					}

					const notificationMessage = returnCorrectMessageType(receiver.primaryDevicePlatform, notificationData)
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

	public static updateGroupMessageStatus (
		receiverIds: Types.ObjectId[],
		fromUserId: Types.ObjectId,
		updatedGroupMessage: GroupMessageWithChatId,
		newMessageStatus: MessageStatuses,
	): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiverId of receiverIds) {
				if (socketManager.isUserOnline(receiverId) === false) {
					continue
				}
				socketManager.updateGroupMessageStatus(receiverId, fromUserId, updatedGroupMessage, newMessageStatus)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static updateGroupMessage(receiverIds: Types.ObjectId[], groupMessage: GroupMessageWithChatId): void {
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

	public static deleteGroupMessage(receiverIds: Types.ObjectId[], groupMessage: GroupMessageWithChatId): void {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiverId of receiverIds) {
				if (socketManager.isUserOnline(receiverId) === false) {
					continue
				}
				socketManager.deleteGroupMessage(receiverId, groupMessage)
			}
		} catch (error) {
			console.error(error)
		}
	}

	public static async replyToGroupMessage(receivers: User[], groupMessage: GroupMessageWithChatId): Promise<void> {
		try {
			const socketManager = SocketManager.getInstance()
			for (const receiver of receivers) {
				if (socketManager.isUserOnline(receiver._id) === true) {
					socketManager.sendGroupMessage(receiver._id, groupMessage)
				} if (
					socketManager.isUserStatusBackground(receiver._id) === true ||
					socketManager.isUserOnline(receiver._id) === false
				) {
					// eslint-disable-next-line max-depth
					if (!_.isString(receiver.notificationToken)) continue
					const endpointArn = getUserArn(receiver)
					// eslint-disable-next-line max-depth
					if (_.isUndefined(endpointArn)) {
						throw new Error("EndpointArn is undefined")
					}

					const extraData = {
						groupChatId: groupMessage.groupChatId,
						groupMessageId: _.toString(groupMessage._id),
					}

					const notificationData: NotificationData = {
						title: `New Message from ${groupMessage.senderDetails.username || "User"}`,
						body: groupMessage.text,
						targetPage: "Group Chat Screen",
						deepLink: `eventfullny://chat/group/${groupMessage.groupChatId}`,
						extraData
					}

					const notificationMessage = returnCorrectMessageType(receiver.primaryDevicePlatform, notificationData)
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
