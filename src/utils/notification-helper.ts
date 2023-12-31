import _ from "lodash"
import { Types } from "mongoose"
import SocketManager from "../classes/socket-manager"
import AwsSnsService from "../classes/aws-sns-service"

// TODO: Make this into a class - won't need the action parameter, or the sendNotification parameter
// (the message parameter will not need to be optional)
export default async function notificationHelper(
	user: User,
	friendId: Types.ObjectId,
	action: "sendFriendRequest" | "retractFriendRequest" | "acceptFriendRequest" | "declineFriendRequest" | "removeFriend",
	sendNotification: boolean = true,
	message?: string
): Promise<void> {
	if (SocketManager.getInstance().isUserOnline(friendId)) {
		if (action === "sendFriendRequest") {
			SocketManager.getInstance().handleSendFriendRequest({ fromUser: user, toUserId: friendId })
		} else if (action === "retractFriendRequest") {
			SocketManager.getInstance().handleRetractFriendRequest({ fromUserId: user._id, toUserId: friendId })
		}
	} else {
		if (_.isString(user.notificationToken) && sendNotification === true) {
			await AwsSnsService.getInstance().sendNotification(
				user.notificationToken,
				message || ""
			)
		} else {
			console.log("User does not have a notification token")
		}
	}
}
