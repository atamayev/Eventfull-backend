import express from "express"
import createDirectMessageChat from "../../controllers/social/chat/create-direct-mesage-chat"
import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmDirectMessageChatDoesntExist from "../../middleware/social/chat/confirm-direct-message-chat-doesnt-exist"

const chatSocialRoutes = express.Router()

chatSocialRoutes.post(
	"/create-direct-message-chat",
	validateFriendId,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	confirmDirectMessageChatDoesntExist,
	createDirectMessageChat
)

export default chatSocialRoutes
