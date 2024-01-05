import express from "express"

import validateFriendIds from "../../../middleware/request-validation/social/chat/validate-friend-ids"
import confirmUserIsFriendsWithEachFriend from "../../../middleware/social/chat/confirm-user-is-friends-with-each-friend"
import confirmUserHasntBlockedAnyFriend from "../../../middleware/social/chat/confirm-user-hasnt-blocked-any-friend"
import confirmGroupMessageChatDoesntExist from "../../../middleware/social/chat/confirm-group-message-chat-doesnt-exist"
import confirmFriendsHaveNotBlockedEachother from "../../../middleware/social/chat/confirm-friends-have-not-blocked-eachother"

import createGroupMessageChat from "../../../controllers/social/chat/group/create-group-message-chat"

const groupMessagesRoutes = express.Router()

groupMessagesRoutes.post(
	"create-message-chat",
	validateFriendIds,
	confirmUserHasntBlockedAnyFriend,
	confirmFriendsHaveNotBlockedEachother,
	confirmUserIsFriendsWithEachFriend,
	confirmGroupMessageChatDoesntExist,
	createGroupMessageChat
)

export default groupMessagesRoutes
