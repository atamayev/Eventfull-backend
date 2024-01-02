import _ from "lodash"
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
				socketManager.handleSendFriendRequest({ fromUser: user, toUserId: friend._id })
			} else {
				if (!_.isString(friend.notificationToken)) {
					console.info("Friend does not have a notification token (or friend isn't logged in).")
					return
				}
				const endpointArn = getUserArn(friend.primaryDevicePlatform, friend)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				const message = returnCorrectMessageType(friend.primaryDevicePlatform, user.username || "User")
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
			socketManager.handleRetractFriendRequest({ fromUserId: user._id, toUserId: friend._id })
		} catch (error) {
			console.error(error)
		}
	}
}
