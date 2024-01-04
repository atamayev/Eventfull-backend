import express from "express"

import extractFriendFromChat from "../../middleware/social/chat/extrct-friend-from-chat"
import validateFriendId from "../../middleware/request-validation/social/validate-friend-id"
import confirmUsersAreFriends from "../../middleware/social/friend/confirm-users-are-friends"
import validateDirectMessage from "../../middleware/request-validation/social/validate-direct-message"
import confirmUserIsChatParticipant from "../../middleware/social/chat/confirm-user-is-chat-participant"
import confirmUserHasntBlockedFriend from "../../middleware/social/friend/confirm-user-hasnt-blocked-friend"
import confirmFriendHasntBlockedUser from "../../middleware/social/friend/confirm-friend-hasnt-blocked-user"
import confirmDirectMessageChatDoesntExist from "../../middleware/social/chat/confirm-direct-message-chat-doesnt-exist"

import sendDirectMessage from "../../controllers/social/chat/send-direct-message"
import createDirectMessageChat from "../../controllers/social/chat/create-direct-mesage-chat"

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
	validateDirectMessage,
	extractFriendFromChat,
	confirmUserIsChatParticipant,
	confirmUserHasntBlockedFriend,
	confirmFriendHasntBlockedUser,
	confirmUsersAreFriends,
	sendDirectMessage
)

export default chatSocialRoutes
