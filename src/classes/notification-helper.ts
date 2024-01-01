import _ from "lodash"
import SocketManager from "./socket-manager"
import AwsSnsService from "./aws-sns-service"
import getUserArn from "../utils/auth-helpers/aws/get-user-arn"

export default new class NotificationHelper {
	public async sendFriendRequest (user: User, friend: User): Promise<void> {
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

			let message = ""
			if (friend.primaryDevicePlatform === "android") {
				message = AwsSnsService.getInstance().createGCMMessage(
					"New Friend Request",
					`${user.username} sent you a friend request`,
					"Chat"
				)
			} else if (friend.primaryDevicePlatform === "ios") {
				message = AwsSnsService.getInstance().createAPNSMessage(
					"New Friend Request",
					`${user.username} sent you a friend request`,
					"Chat"
				)
			} else {
				throw new Error(`Platform ${friend.primaryDevicePlatform} is not supported`)
			}
			await AwsSnsService.getInstance().sendNotification(
				endpointArn,
				message
			)
		}
	}

	public retractFriendRequest (user: User, friend: User): void {
		const socketManager = SocketManager.getInstance()
		if (socketManager.isUserOnline(friend._id) === false) {
			return
		}
		socketManager.handleRetractFriendRequest({ fromUserId: user._id, toUserId: friend._id })
	}
}
