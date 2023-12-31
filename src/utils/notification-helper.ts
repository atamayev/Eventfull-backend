import _ from "lodash"
import SocketManager from "../classes/socket-manager"
import AwsSnsService from "../classes/aws-sns-service"
import { getUserArn } from "./auth-helpers/login/update-arn"

export default new class NotificationHelper {
	public async sendFriendRequest (user: User, friend: User): Promise<void> {
		if (SocketManager.getInstance().isUserOnline(friend._id) === true) {
			SocketManager.getInstance().handleSendFriendRequest({ fromUser: user, toUserId: friend._id })
		} else {
			if (!_.isString(friend.notificationToken)) {
				console.info("Friend does not have a notification token.")
				return
			}
			const endpointArn = getUserArn(friend.primaryDevicePlatform, friend)
			if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

			await AwsSnsService.getInstance().sendNotification(
				endpointArn,
				"New Friend Request",
				`${user.username} sent you a friend request`
			)
		}
	}

	public retractFriendRequest (user: User, friend: User): void {
		if (SocketManager.getInstance().isUserOnline(friend._id) === false) {
			return
		}
		SocketManager.getInstance().handleRetractFriendRequest({ fromUserId: user._id, toUserId: friend._id })
	}
}
