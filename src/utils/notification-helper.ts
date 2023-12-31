import _ from "lodash"
import SocketManager from "../classes/socket-manager"
import AwsSnsService from "../classes/aws-sns-service"
import { getUserArn } from "./auth-helpers/login/update-arn"

// TODO: Make this into a class - won't need the action parameter, or the sendNotification parameter
// (the message parameter will not need to be optional)
// eslint-disable-next-line max-params, complexity
export default async function notificationHelper(
	user: User,
	friend: User,
	action: "sendFriendRequest" | "retractFriendRequest" | "acceptFriendRequest" | "declineFriendRequest" | "removeFriend",
	sendNotification: boolean = true,
	message?: string
): Promise<void> {
	try {
		console.log(friend._id)
		if (SocketManager.getInstance().isUserOnline(friend._id) === true) {
			console.log("friend is online")
			if (action === "sendFriendRequest") {
				SocketManager.getInstance().handleSendFriendRequest({ fromUser: user, toUserId: friend._id })
			} else if (action === "retractFriendRequest") {
				SocketManager.getInstance().handleRetractFriendRequest({ fromUserId: user._id, toUserId: friend._id })
			}
		} else {
			console.log("User is not online, here is their notification token:", friend.notificationToken)
			if (_.isString(friend.notificationToken) && sendNotification === true) {
				const endpointArn = getUserArn(friend.primaryDevicePlatform, friend)
				if (_.isUndefined(endpointArn)) throw new Error("EndpointArn is undefined")

				if (action === "sendFriendRequest") {
					await AwsSnsService.getInstance().sendNotification(
						endpointArn,
						"New Friend Request",
						`${user.firstName} ${user.lastName} sent you a friend request`
					)
				}
			} else {
				console.log("Friend does not have a notification token or send notification is false")
			}
		}
	} catch (error) {
		console.error(error)
	}
}
