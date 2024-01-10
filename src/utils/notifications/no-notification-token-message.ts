export default function noNotificationTokenMessage(friend: User): string {
	return `${friend.username || "User"} does not have a notification token (or isn't logged in).`
}
