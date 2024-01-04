import express from "express"

import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import validateDirectMessage from "../../middleware/request-validation/social/validate-direct-message"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmDirectMessageChatDoesntExist from "../../middleware/social/chat/confirm-direct-message-chat-doesnt-exist"

import sendDirectMessage from "../../controllers/social/chat/send-direct-message"
import createDirectMessageChat from "../../controllers/social/chat/create-direct-mesage-chat"
import confirmUserIsChatParticipant from "../../middleware/social/chat/confirm-user-is-chat-participant"

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

chatSocialRoutes.post(
	"/send-direct-message",
	validateFriendId,
	validateDirectMessage,
	confirmUserIsChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	sendDirectMessage
)

export default chatSocialRoutes
